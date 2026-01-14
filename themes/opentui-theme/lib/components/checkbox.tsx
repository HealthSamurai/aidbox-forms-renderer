import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import type { CheckboxProperties } from "@aidbox-forms/theme";
import { useCallback } from "react";
import { useFocusable } from "./focus-provider.tsx";
import { InlineText } from "./utilities.tsx";

export function Checkbox({
  id,
  checked,
  onChange,
  disabled,
  label,
}: CheckboxProperties) {
  const enabled = disabled !== true;
  const { focused } = useFocusable(id, enabled);

  const toggle = useCallback(() => {
    if (!enabled) return;
    onChange();
  }, [enabled, onChange]);

  useKeyboard((key) => {
    if (!focused) return;
    if (key.eventType !== "press") return;

    if (key.name === "space" || key.name === "return" || key.name === "enter") {
      key.preventDefault();
      key.stopPropagation();
      toggle();
    }
  });

  const labelContent = label ? (
    <InlineText dim={!enabled}>{label}</InlineText>
  ) : undefined;

  return (
    <box flexDirection="row" style={{ gap: 1 }}>
      <text>{focused ? ">" : " "}</text>
      <text attributes={enabled ? 0 : TextAttributes.DIM}>
        {checked ? "[x]" : "[ ]"}
      </text>
      {labelContent}
    </box>
  );
}
