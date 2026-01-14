import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";
import { useFocusable } from "./focus-provider.tsx";

export function ActionButton({
  id,
  label,
  onClick,
  disabled,
}: {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean | undefined;
}) {
  const enabled = disabled !== true;
  const { focused } = useFocusable(id, enabled);

  const handleActivate = useCallback(() => {
    if (!enabled) return;
    onClick();
  }, [enabled, onClick]);

  useKeyboard((key) => {
    if (!focused) return;
    if (key.eventType !== "press") return;

    if (key.name === "return" || key.name === "enter" || key.name === "space") {
      key.preventDefault();
      key.stopPropagation();
      handleActivate();
    }
  });

  return (
    <box flexDirection="row" style={{ gap: 1 }}>
      <text>{focused ? ">" : " "}</text>
      <text attributes={enabled ? 0 : TextAttributes.DIM}>[{label}]</text>
    </box>
  );
}
