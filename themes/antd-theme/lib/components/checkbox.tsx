import type { CheckboxProperties } from "@aidbox-forms/theme";
import { Checkbox as AntCheckbox } from "antd";

export function Checkbox({
  id,
  checked,
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: CheckboxProperties) {
  return (
    <AntCheckbox
      id={id}
      checked={checked}
      onChange={onChange}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
    >
      {label}
    </AntCheckbox>
  );
}
