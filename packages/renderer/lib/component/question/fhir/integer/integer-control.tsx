import type { ValueControlProperties } from "../../../../types.ts";
import { IntegerInput } from "./integer-input.tsx";

export function IntegerControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"integer">) {
  const { min, max } = answer.bounds;

  return (
    <IntegerInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      unitLabel={answer.question.unitDisplay}
      min={min}
      max={max}
    />
  );
}
