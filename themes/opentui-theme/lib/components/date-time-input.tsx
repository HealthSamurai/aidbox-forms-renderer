import type { DateTimeInputProperties } from "@aidbox-forms/theme";
import { useFocusable } from "./focus-provider.tsx";

export function DateTimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
}: DateTimeInputProperties) {
  const enabled = disabled !== true;
  const { focused, focusNext } = useFocusable(id, enabled);

  return (
    <box style={{ border: true, height: 3, paddingLeft: 1, paddingRight: 1 }}>
      <input
        value={value}
        placeholder={placeholder ?? "YYYY-MM-DDThh:mm"}
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
