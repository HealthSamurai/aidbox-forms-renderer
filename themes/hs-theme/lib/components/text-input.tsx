import type { TextInputProperties } from "@formbox/theme";
import { inputClass } from "./tokens.ts";

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
  return (
    <input
      id={id}
      className={inputClass}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      inputMode={inputMode}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
