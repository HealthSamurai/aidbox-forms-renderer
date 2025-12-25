import type { ValueControlProps } from "../../../../../types.ts";
import { StringInput } from "./string-input.tsx";

export function StringControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"string">) {
  return (
    <StringInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      inputMode={answer.question.keyboardType}
    />
  );
}
