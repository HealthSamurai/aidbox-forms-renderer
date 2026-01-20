import type { TextAreaProperties } from "@formbox/theme";
import { hasErrorId } from "../utils/aria.ts";

export function TextArea({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  inputMode,
  minLength,
  maxLength,
}: TextAreaProperties) {
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  return (
    <textarea
      id={id}
      className={`nhsuk-textarea nhsuk-u-margin-bottom-0 ${hasErrorId(describedBy) ? "nhsuk-textarea--error" : ""}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
      inputMode={inputMode}
      minLength={minLength}
      maxLength={maxLength}
      rows={5}
    />
  );
}
