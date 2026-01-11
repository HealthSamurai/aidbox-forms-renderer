import type { ValueControlProperties } from "../../../../types.ts";
import { UrlInput } from "./url-input.tsx";

export function UrlControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"url">) {
  const maxLength = answer.question.maxLength;
  const minLength = answer.question.minLength;

  return (
    <UrlInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
