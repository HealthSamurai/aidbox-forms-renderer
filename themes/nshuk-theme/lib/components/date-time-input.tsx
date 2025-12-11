import type { DateTimeInputProps } from "@aidbox-forms/theme";

export function DateTimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: DateTimeInputProps) {
  return (
    <input
      id={id}
      className="nhsuk-input"
      type="datetime-local"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
