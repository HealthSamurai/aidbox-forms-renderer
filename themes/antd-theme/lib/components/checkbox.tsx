import type { CheckboxProperties } from "@formbox/theme";
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
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };

  return (
    <AntCheckbox
      id={id}
      checked={checked}
      onChange={onChange}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      disabled={disabled === true}
    >
      {label}
    </AntCheckbox>
  );
}
