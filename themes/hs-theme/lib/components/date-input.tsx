import type { DateInputProperties } from "@aidbox-forms/theme";
import { inputClass } from "./tokens.ts";

export function DateInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  min,
  max,
}: DateInputProperties) {
  return (
    <input
      id={id}
      className={inputClass}
      type="date"
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
