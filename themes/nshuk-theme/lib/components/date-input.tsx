import type { DateInputProps } from "@aidbox-forms/theme";

export function DateInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: DateInputProps) {
  return (
    <input
      id={id}
      className="nhsuk-input"
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
