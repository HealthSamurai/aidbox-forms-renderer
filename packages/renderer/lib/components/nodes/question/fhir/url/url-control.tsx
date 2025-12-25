import type { ValueControlProps } from "../../../../../types.ts";
import { UrlInput } from "./url-input.tsx";

export function UrlControl({
  answer,
  inputId,
  labelId,
  describedById,
}: ValueControlProps<"url">) {
  return (
    <UrlInput
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
