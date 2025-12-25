import type { ValueControlProps } from "../../../../../types.ts";
import { UrlInput } from "./url-input.tsx";

export function UrlControl({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"url">) {
  return (
    <UrlInput
      inputId={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={answer.question.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={answer.question.readOnly}
    />
  );
}
