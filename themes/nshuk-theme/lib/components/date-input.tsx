import type { DateInputProperties } from "@aidbox-forms/theme";

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
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <div className="nhsuk-form-group">
      <input
        id={id}
        className="nhsuk-input"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        min={min}
        max={max}
      />
    </div>
  );
}
