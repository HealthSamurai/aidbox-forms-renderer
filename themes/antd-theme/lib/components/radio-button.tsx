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
  return (
    <Radio
      id={id}
      name={groupName}
      value={value}
      checked={checked}
      onChange={onChange}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
    >
      {label}
    </Radio>
  );
}
