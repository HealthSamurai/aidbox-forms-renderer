import type { ValueControlProperties } from "../../../../types.ts";
import { NodeHeader } from "../../../node/node-header.tsx";
import { BooleanInput } from "./boolean-input.tsx";

export function BooleanControl({
  answer,
  path,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"boolean">) {
  return (
    <BooleanInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      value={answer.value}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      path={path}
      label={<NodeHeader node={answer.question} as="text" />}
    />
  );
}
