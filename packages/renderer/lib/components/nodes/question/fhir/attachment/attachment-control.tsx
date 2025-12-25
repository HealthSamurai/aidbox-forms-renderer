import type { ValueControlProps } from "../../../../../types.ts";
import { AttachmentInput } from "./attachment-input.tsx";

export function AttachmentControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"attachment">) {
  return (
    <AttachmentInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
