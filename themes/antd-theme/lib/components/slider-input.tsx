import type { SliderInputProperties } from "@aidbox-forms/theme";
import { Slider, Typography } from "antd";

export function SliderInput({
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  lowerLabel,
  upperLabel,
  unitLabel,
}: SliderInputProperties) {
  const labelRow =
    lowerLabel || upperLabel ? (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <Typography.Text>{lowerLabel}</Typography.Text>
        <Typography.Text>{upperLabel}</Typography.Text>
      </div>
    ) : undefined;

  const unit = unitLabel ? (
    <Typography.Text type="secondary">{unitLabel}</Typography.Text>
  ) : undefined;

  return (
    <div>
      {labelRow}
      <Slider
        value={value}
        onChange={(nextValue) => {
          if (typeof nextValue === "number") {
            onChange(nextValue);
          }
        }}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
      {unit}
    </div>
  );
}
