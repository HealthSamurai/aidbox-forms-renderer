import type { ValueControlProps } from "../../../../../types.ts";
import { CodingInput } from "./CodingInput.tsx";

export function CodingControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"coding">) {
  return (
    <CodingInput
      inputId={inputId}
      labelId={labelId}
      describedById={describedById}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
    />
  );
}
