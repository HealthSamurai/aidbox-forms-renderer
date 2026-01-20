import { TextInput as MantineTextInput } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { TextInputProperties } from "@formbox/theme";

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
    <MantineTextInput
      id={id}
      type={type}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.currentTarget.value)
      }
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
