import { Checkbox as MantineCheckbox } from "@mantine/core";
import type { CheckboxProperties } from "@aidbox-forms/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProperties) {
  const describedByProps =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const labelProps = label == undefined ? {} : { label };

  return (
    <MantineCheckbox
      id={id}
      checked={checked}
      onChange={() => onChange()}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProps}
      {...labelProps}
    />
  );
}
