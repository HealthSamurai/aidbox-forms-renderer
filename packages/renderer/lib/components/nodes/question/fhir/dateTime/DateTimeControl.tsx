import type { ValueControlProps } from "../../../../../types.ts";
import { DateTimeInput } from "./DateTimeInput.tsx";

export function DateTimeControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"dateTime">) {
  return (
    <DateTimeInput
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
