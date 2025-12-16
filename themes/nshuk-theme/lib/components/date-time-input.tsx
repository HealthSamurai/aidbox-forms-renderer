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
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <div className="nhsuk-form-group">
      <input
        id={id}
        className="nhsuk-input"
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
      />
    </div>
  );
}
