import type { ValueControlProperties } from "../../../../types.ts";
import { DateInput } from "./date-input.tsx";

export function DateControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"date">) {
  const bounds = answer.bounds;
  const min = typeof bounds.min === "string" ? bounds.min : undefined;
  const max = typeof bounds.max === "string" ? bounds.max : undefined;

  return (
    <DateInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      min={min}
      max={max}
    />
  );
}
