import type { ValueControlProps } from "../../../../../types.ts";
import { StringInput } from "./string-input.tsx";

export function StringControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"string">) {
  return (
    <StringInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      inputMode={answer.question.keyboardType}
    />
  );
}
