import type { ValueControlProps } from "../../../../../types.ts";
import { BooleanInput } from "./boolean-input.tsx";

export function BooleanControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"boolean">) {
  return (
    <BooleanInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
    />
  );
}
