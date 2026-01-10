import type { TimeInputProperties } from "@aidbox-forms/theme";

export function TimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  min,
  max,
}: TimeInputProperties) {
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <div className="nhsuk-form-group">
      <input
        id={id}
        className="nhsuk-input"
        type="time"
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
