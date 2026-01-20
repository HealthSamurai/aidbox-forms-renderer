import { Checkbox as MantineCheckbox } from "@mantine/core";
import type { CheckboxProperties } from "@formbox/theme";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProperties) {
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const labelProperties = label == undefined ? {} : { label };

  return (
    <MantineCheckbox
      id={id}
      checked={checked}
      onChange={() => onChange()}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...labelProperties}
    />
  );
}
