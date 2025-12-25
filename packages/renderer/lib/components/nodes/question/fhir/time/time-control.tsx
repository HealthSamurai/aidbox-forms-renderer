import type { ValueControlProps } from "../../../../../types.ts";
import { TimeInput } from "./time-input.tsx";

export function TimeControl({
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
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
