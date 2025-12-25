import type { ValueControlProps } from "../../../../../types.ts";
import { BooleanInput } from "./boolean-input.tsx";

export function BooleanControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"boolean">) {
  return (
    <BooleanInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
