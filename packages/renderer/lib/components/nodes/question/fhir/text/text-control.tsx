import type { ValueControlProps } from "../../../../../types.ts";
import { TextInput } from "./text-input.tsx";

export function TextControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"text">) {
  return (
    <TextInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
