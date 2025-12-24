import type { ValueControlProps } from "../../../../../types.ts";
import { TextInput } from "./TextInput.tsx";

export function TextControl({
  node,
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
      placeholder={node.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
    />
  );
}
