import type { DateInputProperties } from "@aidbox-forms/theme";
import { useFocusable } from "./focus-provider.tsx";

export function DateInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
}: DateInputProperties) {
  const enabled = disabled !== true;
  const { focused, focusNext } = useFocusable(id, enabled);

  return (
    <box style={{ border: true, height: 3, paddingLeft: 1, paddingRight: 1 }}>
      <input
        value={value}
        placeholder={placeholder ?? "YYYY-MM-DD"}
        focused={focused}
        onInput={(next) => {
          if (!enabled) return;
          onChange(next);
        }}
        onSubmit={() => {
          if (!enabled) return;
          focusNext();
        }}
      />
    </box>
  );
}
