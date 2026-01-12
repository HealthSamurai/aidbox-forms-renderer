import { Radio } from "@mantine/core";
import type { RadioButtonProperties } from "@aidbox-forms/theme";

export function RadioButton({
  id,
  groupName,
  value,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: RadioButtonProperties) {
  const describedByProps =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const labelProps = label == undefined ? {} : { label };

  return (
    <Radio
      id={id}
      name={groupName}
      value={value}
      checked={checked}
      onChange={() => onChange()}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProps}
      {...labelProps}
    />
  );
}
