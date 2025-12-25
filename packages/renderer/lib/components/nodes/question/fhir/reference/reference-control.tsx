import type { ValueControlProps } from "../../../../../types.ts";
import { ReferenceInput } from "./reference-input.tsx";

export function ReferenceControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"reference">) {
  return (
    <ReferenceInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      placeholder={answer.question.placeholder}
    />
  );
}
