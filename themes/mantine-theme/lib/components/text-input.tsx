import { TextInput as MantineTextInput } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { TextInputProperties } from "@aidbox-forms/theme";

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
  const describedByProps =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProps = placeholder == undefined ? {} : { placeholder };
  const inputModeProps = inputMode == undefined ? {} : { inputMode };
  const minLengthProps = minLength == undefined ? {} : { minLength };
  const maxLengthProps = maxLength == undefined ? {} : { maxLength };

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
      {...describedByProps}
      {...placeholderProps}
      {...inputModeProps}
      {...minLengthProps}
      {...maxLengthProps}
    />
  );
}
