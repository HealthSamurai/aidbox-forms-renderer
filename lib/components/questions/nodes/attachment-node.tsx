import React from "react";
import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { IQuestionStore } from "../../../stores/types.ts";
import type { Attachment } from "fhir/r5";
import {
  omit,
  prepareAttachmentFromFile,
  pruneAttachment,
} from "../../../utils.ts";

export const AttachmentNode = observer(function AttachmentNode({
  item,
}: {
  item: IQuestionStore<"attachment">;
}) {
  return (
    <div className="af-item af-item-attachment" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => {
          const attachment = value ?? {};
          const describedByAttrId = describedById ?? undefined;

          const handleUrlChange = (url: string) => {
            const draft: Attachment = { ...attachment, url: url || undefined };
            setValue(pruneAttachment(draft));
          };

          const handleTitleChange = (title: string) => {
            const draft: Attachment = {
              ...attachment,
              title: title || undefined,
            };
            setValue(pruneAttachment(draft));
          };

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
            const cleared = omit(attachment, [
              "data",
              "contentType",
              "size",
              "hash",
            ]);
            setValue(pruneAttachment(cleared));
          };

          const hasFile =
            Boolean(attachment.data) ||
            Boolean(attachment.url) ||
            Boolean(attachment.title);
          const sizeKb =
            typeof attachment.size === "number"
              ? Math.round(attachment.size / 1024)
              : undefined;

          return (
            <div>
              <input
                id={`${inputId}-file`}
                type="file"
                onChange={handleFileChange}
                disabled={item.readOnly}
                aria-labelledby={labelId}
                aria-describedby={describedByAttrId}
              />
              {attachment.title ? (
                <div>
                  <strong>{attachment.title}</strong>
                  {sizeKb !== undefined ? (
                    <span>{` (${sizeKb} KB)`}</span>
                  ) : null}
                </div>
              ) : null}
              <TextInput
                id={`${inputId}-url`}
                type="url"
                ariaLabelledBy={labelId}
                ariaDescribedBy={describedByAttrId}
                value={attachment.url ?? ""}
                onChange={handleUrlChange}
                disabled={item.readOnly}
                placeholder="https://..."
              />
              <TextInput
                id={`${inputId}-title`}
                ariaLabelledBy={labelId}
                ariaDescribedBy={describedByAttrId}
                value={attachment.title ?? ""}
                onChange={handleTitleChange}
                disabled={item.readOnly}
                placeholder="Title"
              />
              <div>
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={item.readOnly || !hasFile}
                >
                  Clear attachment
                </button>
              </div>
            </div>
          );
        }}
      />
      <ItemErrors item={item} />
    </div>
  );
});
