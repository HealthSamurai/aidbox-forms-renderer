import type { ValueControlProperties } from "../../../../types.ts";
import { ReferenceInput } from "./reference-input.tsx";

export function ReferenceControl({
  answer,
  path,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"reference">) {
  return (
    <ReferenceInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      placeholder={answer.question.placeholder}
      path={path}
    />
  );
}
