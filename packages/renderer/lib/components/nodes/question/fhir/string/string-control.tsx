import type { ValueControlProps } from "../../../../../types.ts";
import { StringInput } from "./string-input.tsx";

export function StringControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"string">) {
  return (
    <StringInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={node.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
      inputMode={node.keyboardType}
    />
  );
}
