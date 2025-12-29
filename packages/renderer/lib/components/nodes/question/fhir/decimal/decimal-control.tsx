import type { ValueControlProps } from "../../../../../types.ts";
import { DecimalInput } from "./decimal-input.tsx";

export function DecimalControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"decimal">) {
  const bounds = answer.bounds;
  let min =
    typeof bounds.min === "number" && Number.isFinite(bounds.min)
      ? bounds.min
      : undefined;
  let max =
    typeof bounds.max === "number" && Number.isFinite(bounds.max)
      ? bounds.max
      : undefined;
  if (min != null && max != null && min > max) {
    min = undefined;
    max = undefined;
  }

  const maxDecimalPlaces = answer.question.maxDecimalPlaces;
  const step = maxDecimalPlaces != null ? 1 / 10 ** maxDecimalPlaces : "any";

  return (
    <DecimalInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      unitLabel={answer.question.unitDisplay}
      min={min}
      max={max}
      step={step}
    />
  );
}
