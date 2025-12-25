import type { ValueControlProps } from "../../../../../types.ts";
import { DateTimeInput } from "./date-time-input.tsx";

export function DateTimeControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"dateTime">) {
  return (
    <DateTimeInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
