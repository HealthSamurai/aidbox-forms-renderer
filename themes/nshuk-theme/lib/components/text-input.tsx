import type { TextInputProperties } from "@aidbox-forms/theme";
import { hasErrorId } from "../utils/aria.ts";

export function TextInput({
  id,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  inputMode,
  minLength,
  maxLength,
}: TextInputProperties) {
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
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
      inputMode={inputMode}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
