import { useStateContext } from "../../state/state-context.ts";
import type { QuestionnaireItem, Attachment } from "fhir/r5";
import { coerceAttachment } from "../../utils/answer-coercions";
import { renderItemChildren } from "./item-children";
import { renderItemLabel } from "./item-label";

interface AttachmentItemProps {
  item: QuestionnaireItem;
}

export function AttachmentItem({ item }: AttachmentItemProps) {
  const { readValue, writeValue } = useStateContext();
  const value = readValue(item);
  const attachment = coerceAttachment(value) ?? {};
  const inputId = `q-${item.linkId}`;

  const update = (partial: Partial<Attachment>) => {
    const next: Attachment = { ...attachment, ...partial };
    if (!next.url && !next.data && !next.title && !next.contentType) {
      writeValue(item, undefined);
    } else {
      writeValue(item, next);
    }
  };

  return (
    <div className="q-item q-item-attachment">
      {renderItemLabel(item, inputId)}
      <input
        id={`${inputId}-url`}
        type="url"
        placeholder="URL"
        value={attachment.url ?? ""}
        onChange={(event) => update({ url: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      <input
        id={`${inputId}-content-type`}
        type="text"
        placeholder="Content type"
        value={attachment.contentType ?? ""}
        onChange={(event) => update({ contentType: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      <textarea
        id={`${inputId}-data`}
        placeholder="Base64 data"
        value={attachment.data ?? ""}
        onChange={(event) => update({ data: event.target.value || undefined })}
        disabled={item.readOnly}
      />
      {renderItemChildren(item)}
    </div>
  );
}
