import type { TimeInputProps } from "@aidbox-forms/theme";

export function TimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: TimeInputProps) {
  return (
    <input
      id={id}
      className="nhsuk-input"
      type="time"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
