import type { ValueControlProps } from "../../../../../types.ts";
import { BooleanInput } from "./boolean-input.tsx";

export function BooleanControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"boolean">) {
  return (
    <BooleanInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
