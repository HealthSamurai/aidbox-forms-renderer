import type { ValueControlProperties } from "../../../../types.ts";
import { QuantityInput } from "./quantity-input.tsx";

export function QuantityControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"quantity">) {
  return (
    <QuantityInput
      answer={answer}
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      disabled={answer.question.readOnly}
    />
  );
}
