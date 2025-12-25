import type { ValueControlProps } from "../../../../../types.ts";
import { DecimalInput } from "./decimal-input.tsx";

export function DecimalControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"decimal">) {
  return (
    <DecimalInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      unitLabel={answer.question.unitDisplay}
    />
  );
}
