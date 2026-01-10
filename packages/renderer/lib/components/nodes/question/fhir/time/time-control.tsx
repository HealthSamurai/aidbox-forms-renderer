import type { ValueControlProperties } from "../../../../../types.ts";
import { TimeInput } from "./time-input.tsx";

export function TimeControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"time">) {
  const bounds = answer.bounds;
  const min = typeof bounds.min === "string" ? bounds.min : undefined;
  const max = typeof bounds.max === "string" ? bounds.max : undefined;

  return (
    <TimeInput
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
