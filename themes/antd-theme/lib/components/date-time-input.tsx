import type { DateTimeInputProperties } from "@formbox/theme";
import { Input } from "antd";

export function DateTimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  min,
  max,
}: DateTimeInputProperties) {
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const minProperties = min == undefined ? {} : { min };
  const maxProperties = max == undefined ? {} : { max };

  return (
    <Input
      id={id}
      type="datetime-local"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...placeholderProperties}
      {...minProperties}
      {...maxProperties}
    />
  );
}
