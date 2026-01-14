import type { SliderInputProperties } from "@aidbox-forms/theme";
import type { InputRenderable } from "@opentui/core";
import { useEffect, useRef } from "react";
import { useFocusable } from "./focus-provider.tsx";
import { clamp } from "./utilities.tsx";

export function SliderInput({
  id,
  value,
  onChange,
  disabled,
  min,
  max,
  lowerLabel,
  upperLabel,
  unitLabel,
}: SliderInputProperties) {
  const enabled = disabled !== true;
  const { focused, focusNext } = useFocusable(id, enabled);

  const valueString = value === undefined ? "" : String(value);
  const inputReference = useRef<InputRenderable>(null);
  const isInitializedReference = useRef(false);

  useEffect(() => {
    const input = inputReference.current;
    if (!input) return;

    if (!isInitializedReference.current) {
      input.value = valueString;
      isInitializedReference.current = true;
      return;
    }

    if (focused) return;

    if (input.value !== valueString) {
      input.value = valueString;
    }
  }, [focused, valueString]);

  return (
    <box flexDirection="column" style={{ gap: 0 }}>
      {lowerLabel || upperLabel ? (
        <text>
          <span fg="#666666">{lowerLabel ?? ""}</span>
          <span fg="#666666">{lowerLabel && upperLabel ? " … " : ""}</span>
          <span fg="#666666">{upperLabel ?? ""}</span>
        </text>
      ) : undefined}
      <box flexDirection="row" style={{ gap: 1 }}>
        <box
          style={{
            border: true,
            height: 3,
            paddingLeft: 1,
            paddingRight: 1,
            flexGrow: 1,
          }}
        >
          <input
            ref={inputReference}
            placeholder=""
            focused={focused}
            onInput={(next) => {
              if (!enabled) return;

              const trimmed = next.trim();
              if (trimmed.length === 0) {
                onChange();
                return;
              }

              const parsed = Number(trimmed);
              if (Number.isNaN(parsed)) {
                onChange();
                return;
              }

              const clampedValue = clamp(parsed, min ?? parsed, max ?? parsed);
              onChange(clampedValue);
            }}
            onSubmit={() => {
              if (!enabled) return;
              focusNext();
            }}
          />
        </box>
        {unitLabel ? <text>{unitLabel}</text> : undefined}
      </box>
    </box>
  );
}
