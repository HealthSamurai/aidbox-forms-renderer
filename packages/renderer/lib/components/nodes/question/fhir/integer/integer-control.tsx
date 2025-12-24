import type { ValueControlProps } from "../../../../../types.ts";
import { IntegerInput } from "./integer-input.tsx";

export function IntegerControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"integer">) {
  return (
    <IntegerInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      placeholder={node.placeholder}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
      unitLabel={node.unitDisplay}
    />
  );
}
