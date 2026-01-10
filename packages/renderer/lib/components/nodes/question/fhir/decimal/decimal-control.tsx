import type { ValueControlProperties } from "../../../../../types.ts";
import { DecimalInput } from "./decimal-input.tsx";

export function DecimalControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"decimal">) {
  const { min, max } = answer.bounds;
  const maxDecimalPlaces = answer.question.maxDecimalPlaces;

  return (
    <DecimalInput
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
      step={maxDecimalPlaces == undefined ? "any" : 1 / 10 ** maxDecimalPlaces}
    />
  );
}
