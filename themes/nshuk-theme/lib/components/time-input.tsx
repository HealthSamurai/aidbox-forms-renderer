import type { TimeInputProperties } from "@aidbox-forms/theme";
import { hasErrorId } from "../utils/aria.ts";

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
  const className = hasErrorId(describedBy)
    ? "nhsuk-input nhsuk-input--error"
    : "nhsuk-input";

  return (
    <input
      id={id}
      className={className}
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
  );
}
