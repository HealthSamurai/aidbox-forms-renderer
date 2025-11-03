import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { Button } from "../../controls/button.tsx";
import type { RowRenderProps } from "../../common/answer.tsx";
import { IQuestionNode } from "../../../stores/types.ts";
import type { Attachment } from "fhir/r5";
import { prepareAttachmentFromFile, pruneAttachment } from "../../../utils.ts";

export const AttachmentNode = observer(function AttachmentNode({
  item,
}: {
  item: IQuestionNode<"attachment">;
}) {
  return (
    <div className="af-item af-item-attachment" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={(props) => <AttachmentAnswerRow {...props} item={item} />}
      />
      <ItemErrors item={item} />
    </div>
  );
});

type AttachmentRowProps = RowRenderProps<Attachment> & {
  item: IQuestionNode<"attachment">;
};

const AttachmentAnswerRow = observer(function AttachmentAnswerRow({
  value,
  setValue,
  inputId,
  labelId,
  describedById,
  item,
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
    if (item.readOnly) {
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
        disabled={item.readOnly}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        style={hasAttachment ? { display: "none" } : undefined}
      />
      {hasAttachment ? (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedById}
          className="af-attachment-summary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span
            className="af-attachment-summary__label"
            style={{ flex: "1 1 auto" }}
          >
            {displayLabel}
            {sizeKb !== undefined ? ` (${sizeKb} KB)` : ""}
          </span>
          {!item.readOnly ? (
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
            disabled={item.readOnly}
          >
            Clear attachment
          </Button>
        </div>
      ) : null}
    </div>
  );
});
