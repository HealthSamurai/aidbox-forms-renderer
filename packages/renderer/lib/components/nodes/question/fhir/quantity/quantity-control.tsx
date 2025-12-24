import type { ValueControlProps } from "../../../../../types.ts";
import { QuantityInput } from "./quantity-input.tsx";

export function QuantityControl({
  node,
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
      placeholder={node.placeholder}
      disabled={node.readOnly}
    />
  );
}
