import type { TextInputProperties } from "@formbox/theme";
import { Input } from "antd";

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
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const inputModeProperties = inputMode == undefined ? {} : { inputMode };
  const minLengthProperties = minLength == undefined ? {} : { minLength };
  const maxLengthProperties = maxLength == undefined ? {} : { maxLength };

  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...placeholderProperties}
      {...inputModeProperties}
      {...minLengthProperties}
      {...maxLengthProperties}
    />
  );
}
