import type { ValueControlProps } from "../../../../../types.ts";
import { DateInput } from "./date-input.tsx";

export function DateControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"date">) {
  return (
    <DateInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
