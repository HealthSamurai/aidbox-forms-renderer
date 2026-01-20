import { Radio } from "@mantine/core";
import type { RadioButtonProperties } from "@formbox/theme";

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
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const labelProperties = label == undefined ? {} : { label };

  return (
    <Radio
      id={id}
      name={groupName}
      value={value}
      checked={checked}
      onChange={() => onChange()}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...labelProperties}
    />
  );
}
