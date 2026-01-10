import type { ValueControlProperties } from "../../../../../types.ts";
import { dedupe } from "../../../../../utilities.ts";
import { AttachmentInput } from "./attachment-input.tsx";

export function AttachmentControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"attachment">) {
  const acceptValues = answer.question.mimeTypes;
  const accept =
    acceptValues.length > 0 ? dedupe(acceptValues).join(",") : undefined;

  return (
    <AttachmentInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      accept={accept}
    />
  );
}
