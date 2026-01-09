import type { ValueControlProps } from "../../../../../types.ts";
import { NodeHeader } from "../../../../form/node-header.tsx";
import { BooleanInput } from "./boolean-input.tsx";

export function BooleanControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"boolean">) {
  return (
    <BooleanInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value ?? null}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      label={<NodeHeader node={answer.question} as="text" />}
    />
  );
}
