import type { ValueControlProps } from "../../../../../types.ts";
import { IntegerInput } from "./integer-input.tsx";

export function IntegerControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"integer">) {
  return (
    <IntegerInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={answer.question.placeholder}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      unitLabel={answer.question.unitDisplay}
    />
  );
}
