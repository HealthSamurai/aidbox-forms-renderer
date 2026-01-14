import type { TextareaRenderable } from "@opentui/core";
import { useEffect, useRef } from "react";
import type { TextAreaProperties } from "@aidbox-forms/theme";
import { useFocusable } from "./focus-provider.tsx";

export function TextArea({
  id,
  value,
  onChange,
  disabled,
  placeholder,
}: TextAreaProperties) {
  const enabled = disabled !== true;
  const { focused } = useFocusable(id, enabled);
  const textareaReference = useRef<TextareaRenderable>(null);

  useEffect(() => {
    if (focused) return;

    const current = textareaReference.current;
    if (!current) return;

    if (current.plainText !== value) {
      current.setText(value);
    }
  }, [focused, value]);

  return (
    <box style={{ border: true, height: 8, paddingLeft: 1, paddingRight: 1 }}>
      <textarea
        ref={textareaReference}
        placeholder={placeholder ?? ""}
        initialValue={value}
        focused={focused}
        onContentChange={() => {
          if (!enabled) return;

          const currentValue = textareaReference.current?.plainText ?? "";
          if (currentValue !== value) {
            onChange(currentValue);
          }
        }}
      />
    </box>
  );
}
