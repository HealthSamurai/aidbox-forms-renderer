import type { NumberInputProperties } from "@formbox/theme";
import { InputNumber, Typography } from "antd";

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  min,
  max,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
}: NumberInputProperties) {
  const handleChange = (nextValue: number | string | null) => {
    if (nextValue === null || nextValue === "") {
      onChange();
      return;
    }
    if (typeof nextValue === "number") {
      onChange(nextValue);
      return;
    }
    const parsed = Number(nextValue);
    if (Number.isNaN(parsed)) {
      onChange();
      return;
    }
    onChange(parsed);
  };

  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const stepProperties = step == undefined ? {} : { step };
  const minProperties = min == undefined ? {} : { min };
  const maxProperties = max == undefined ? {} : { max };

  const input = (
    <InputNumber
      id={id}
      value={value ?? ""}
      onChange={handleChange}
      disabled={disabled === true}
      aria-labelledby={ariaLabelledBy}
      {...describedByProperties}
      {...placeholderProperties}
      {...stepProperties}
      {...minProperties}
      {...maxProperties}
      style={{ width: "100%" }}
    />
  );

  if (!unitLabel) {
    return input;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{input}</div>
      <Typography.Text>{unitLabel}</Typography.Text>
    </div>
  );
}
