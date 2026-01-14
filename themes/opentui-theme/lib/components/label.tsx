import { TextAttributes } from "@opentui/core";
import type { LabelProperties } from "@aidbox-forms/theme";
import { toPlainText } from "./utilities.tsx";

function isTextLike(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function Label({
  prefix,
  children,
  id,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: LabelProperties) {
  const emphasize = as !== "text";
  const attributes = emphasize ? TextAttributes.BOLD : 0;

  const prefixText = prefix ? toPlainText(prefix) : "";

  const childIsText = isTextLike(children);
  const childText = childIsText ? String(children) : "";

  return (
    <box flexDirection="column" style={{ gap: 0 }}>
      <box flexDirection="row" style={{ gap: 1 }}>
        {prefixText ? (
          <text attributes={attributes}>{prefixText}</text>
        ) : undefined}

        {childIsText ? (
          <text id={id} attributes={attributes}>
            {childText}
            {required ? " *" : ""}
          </text>
        ) : (
          <box id={id} style={{ flexGrow: 1, minWidth: 0 }}>
            {children}
          </box>
        )}

        {!childIsText && required ? (
          <text attributes={attributes}>*</text>
        ) : undefined}
      </box>

      {help}
      {legal}
      {flyover}
    </box>
  );
}
