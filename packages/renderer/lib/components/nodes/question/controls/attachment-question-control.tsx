import "./attachment-question-control.css";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useMemo, useRef } from "react";
import type { IQuestionNode } from "../../../../types.ts";
import type { RowRenderProps } from "../answer.tsx";
import { AnswerList } from "../answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { Button } from "../../../controls/button.tsx";
import {
  prepareAttachmentFromFile,
  pruneAttachment,
} from "../../../../utils.ts";

type AttachmentRowProps = RowRenderProps<"attachment"> & {
  node: IQuestionNode<"attachment">;
};

const AttachmentAnswerRow = observer(function AttachmentAnswerRow({
  value,
  setValue,
  inputId,
  labelId,
  describedById,
  node,
}: AttachmentRowProps) {
  const attachment = value ?? {};
  const hasAttachment = value != null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const updated = await prepareAttachmentFromFile(file, attachment);
      setValue(pruneAttachment(updated));
    } finally {
      input.value = "";
    }
  };

  const handleClearFile = () => {
    setValue(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFilePicker = () => {
    if (node.readOnly) {
      return;
    }
    fileInputRef.current?.click();
  };

  const sizeKb =
    typeof attachment.size === "number"
      ? Math.round(attachment.size / 1024)
      : undefined;

  const displayLabel =
    attachment.title ?? attachment.url ?? "Attachment selected";

  return (
    <div>
      <input
        ref={fileInputRef}
        id={`${inputId}-file`}
        type="file"
        onChange={(event) => {
          void handleFileChange(event);
        }}
        disabled={node.readOnly}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className={classNames("af-attachment-input", {
          "af-attachment-input--hidden": hasAttachment,
        })}
      />
      {hasAttachment ? (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedById}
          className="af-attachment-summary"
        >
          <span className="af-attachment-summary__label">
            {displayLabel}
            {sizeKb !== undefined ? ` (${sizeKb} KB)` : ""}
          </span>
          {!node.readOnly ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleTriggerFilePicker}
            >
              Change file
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearFile}
            disabled={node.readOnly}
          >
            Clear attachment
          </Button>
        </div>
      ) : null}
    </div>
  );
});

export const AttachmentQuestionControl = observer(
  function AttachmentQuestionControl({
    node,
  }: {
    node: IQuestionNode<"attachment">;
  }) {
    const renderRow = useMemo(
      () => (rowProps: RowRenderProps<"attachment">) => (
        <AttachmentAnswerRow {...rowProps} node={node} />
      ),
      [node],
    );

    return (
      <QuestionScaffold
        node={node}
        className="af-node-attachment"
        answers={<AnswerList node={node} renderRow={renderRow} />}
      />
    );
  },
);
