import type { ValueControlProperties } from "../../../../../types.ts";
import { DateTimeInput } from "./date-time-input.tsx";

export function DateTimeControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"dateTime">) {
  const bounds = answer.bounds;
  const min = typeof bounds.min === "string" ? bounds.min : undefined;
  const max = typeof bounds.max === "string" ? bounds.max : undefined;

  return (
    <DateTimeInput
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
