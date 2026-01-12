import type { RadioButtonProperties } from "@aidbox-forms/theme";
import { Radio } from "antd";

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

  return (
    <Radio
      id={id}
      name={groupName}
      value={value}
      checked={checked}
      onChange={onChange}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      disabled={disabled === true}
    >
      {label}
    </Radio>
  );
}
