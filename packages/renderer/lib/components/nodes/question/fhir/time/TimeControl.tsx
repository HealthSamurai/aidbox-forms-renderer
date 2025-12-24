import type { ValueControlProps } from "../../../../../types.ts";
import { TimeInput } from "./TimeInput.tsx";

export function TimeControl({
  node,
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"time">) {
  return (
    <TimeInput
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
