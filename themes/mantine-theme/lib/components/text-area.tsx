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
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const inputModeProperties = inputMode == undefined ? {} : { inputMode };
  const minLengthProperties = minLength == undefined ? {} : { minLength };
  const maxLengthProperties = maxLength == undefined ? {} : { maxLength };

  return (
    <Textarea
      id={id}
      value={value}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
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
