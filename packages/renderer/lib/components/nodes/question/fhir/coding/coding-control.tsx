import type { ValueControlProperties } from "../../../../../types.ts";
import { CodingInput } from "./coding-input.tsx";

export function CodingControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"coding">) {
  return (
    <CodingInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
