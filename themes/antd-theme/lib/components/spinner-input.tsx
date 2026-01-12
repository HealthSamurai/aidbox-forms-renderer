import type { SpinnerInputProperties } from "@aidbox-forms/theme";
import { InputNumber, Typography } from "antd";

export function SpinnerInput({
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
}: SpinnerInputProperties) {
  const handleChange = (nextValue: number | string | null) => {
    if (nextValue === null) {
      onChange(undefined);
      return;
    }
    if (typeof nextValue === "number") {
      onChange(nextValue);
      return;
    }
    const parsed = Number(nextValue);
    onChange(Number.isNaN(parsed) ? undefined : parsed);
  };

  const input = (
    <InputNumber
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
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
