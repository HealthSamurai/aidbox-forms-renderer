import type { ValueControlProps } from "../../../../../types.ts";
import { DateInput } from "./date-input.tsx";

export function DateControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"date">) {
  return (
    <DateInput
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
