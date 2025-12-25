import type { ValueControlProps } from "../../../../../types.ts";
import { IntegerInput } from "./integer-input.tsx";

export function IntegerControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"integer">) {
  return (
    <IntegerInput
      id={id}
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
