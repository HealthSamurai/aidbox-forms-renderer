import type { ValueControlProps } from "../../../../../types.ts";
import { CodingInput } from "./coding-input.tsx";

export function CodingControl({
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
      disabled={answer.question.readOnly}
    />
  );
}
