import type { ValueControlProps } from "../../../../../types.ts";
import { ReferenceInput } from "./reference-input.tsx";

export function ReferenceControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"reference">) {
  return (
    <ReferenceInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      placeholder={answer.question.placeholder}
    />
  );
}
