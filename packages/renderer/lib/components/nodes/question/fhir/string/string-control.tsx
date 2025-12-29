import type { ValueControlProps } from "../../../../../types.ts";
import { StringInput } from "./string-input.tsx";

export function StringControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"string">) {
  const maxLength = answer.question.maxLength;
  const minLength = answer.question.minLength;

  return (
    <StringInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      inputMode={answer.question.keyboardType}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
