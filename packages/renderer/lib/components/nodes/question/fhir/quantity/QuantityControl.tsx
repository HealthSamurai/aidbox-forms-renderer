import type { ValueControlProps } from "../../../../../types.ts";
import { QuantityInput } from "./QuantityInput.tsx";

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
