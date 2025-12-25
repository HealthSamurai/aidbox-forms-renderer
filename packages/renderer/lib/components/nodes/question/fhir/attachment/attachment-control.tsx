import type { ValueControlProps } from "../../../../../types.ts";
import { AttachmentInput } from "./attachment-input.tsx";

export function AttachmentControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"attachment">) {
  return (
    <AttachmentInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
