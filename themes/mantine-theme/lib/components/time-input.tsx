import { TextInput as MantineTextInput } from "@mantine/core";
import type { ChangeEvent } from "react";
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
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const minProperties = min == undefined ? {} : { min };
  const maxProperties = max == undefined ? {} : { max };

  return (
    <MantineTextInput
      id={id}
      type="time"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.currentTarget.value)
      }
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...placeholderProperties}
      {...minProperties}
      {...maxProperties}
    />
  );
}
