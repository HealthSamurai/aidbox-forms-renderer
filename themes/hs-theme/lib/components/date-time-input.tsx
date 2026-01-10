import type { DateTimeInputProperties } from "@aidbox-forms/theme";
import { inputClass } from "./tokens.ts";

export function DateTimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  min,
  max,
}: DateTimeInputProperties) {
  return (
    <input
      id={id}
      className={inputClass}
      type="datetime-local"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      min={min}
      max={max}
    />
  );
}
