import type { ValueControlProps } from "../../../../../types.ts";
import { QuantityInput } from "./quantity-input.tsx";

export function QuantityControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"quantity">) {
  return (
    <QuantityInput
      answer={answer}
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={answer.question.placeholder}
      disabled={answer.question.readOnly}
    />
  );
}
