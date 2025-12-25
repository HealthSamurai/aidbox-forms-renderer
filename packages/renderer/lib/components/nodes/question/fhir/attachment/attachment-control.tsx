import type { ValueControlProps } from "../../../../../types.ts";
import { AttachmentInput } from "./attachment-input.tsx";

export function AttachmentControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"attachment">) {
  return (
    <AttachmentInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
