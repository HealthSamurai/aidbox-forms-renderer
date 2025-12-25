import type { ValueControlProps } from "../../../../../types.ts";
import { TextInput } from "./text-input.tsx";

export function TextControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"text">) {
  return (
    <TextInput
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
