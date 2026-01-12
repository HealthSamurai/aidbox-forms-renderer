import { Textarea } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { TextAreaProperties } from "@aidbox-forms/theme";

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
  const describedByProps =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProps = placeholder == undefined ? {} : { placeholder };
  const inputModeProps = inputMode == undefined ? {} : { inputMode };
  const minLengthProps = minLength == undefined ? {} : { minLength };
  const maxLengthProps = maxLength == undefined ? {} : { maxLength };

  return (
    <Textarea
      id={id}
      value={value}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
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
