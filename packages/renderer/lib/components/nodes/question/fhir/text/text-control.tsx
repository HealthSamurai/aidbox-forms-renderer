import type { ValueControlProps } from "../../../../../types.ts";
import { TextInput } from "./text-input.tsx";

export function TextControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"text">) {
  const maxLength = answer.question.maxLength;
  const minLength = answer.question.minLength;

  return (
    <TextInput
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
