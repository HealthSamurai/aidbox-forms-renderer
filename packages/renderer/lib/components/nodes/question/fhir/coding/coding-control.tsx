import type { ValueControlProps } from "../../../../../types.ts";
import { CodingInput } from "./coding-input.tsx";

export function CodingControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"coding">) {
  return (
    <CodingInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
