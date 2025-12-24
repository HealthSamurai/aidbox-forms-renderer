import type { ValueControlProps } from "../../../../../types.ts";
import { UrlInput } from "./UrlInput.tsx";

export function UrlControl({
  node,
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
      placeholder={node.placeholder}
      value={answer.value ?? ""}
      onChange={(value) => answer.setValueByUser(value)}
      disabled={node.readOnly}
    />
  );
}
