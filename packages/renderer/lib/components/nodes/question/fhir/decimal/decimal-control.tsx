import type { ValueControlProps } from "../../../../../types.ts";
import { DecimalInput } from "./decimal-input.tsx";

export function DecimalControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"decimal">) {
  return (
    <DecimalInput
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
