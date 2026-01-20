import type { SliderInputProperties } from "@formbox/theme";
import { Slider, Typography } from "antd";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SliderInput({
  id,
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
  const sliderMin = typeof min === "number" ? min : 0;
  const sliderMax = typeof max === "number" ? max : sliderMin + 100;
  const normalizedValue = clamp(
    typeof value === "number" ? value : sliderMin,
    sliderMin,
    sliderMax,
  );
  const stepValue =
    typeof step === "number" && Number.isFinite(step) && step !== 0 ? step : 1;
  const describedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };

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
    <div id={id}>
      {labelRow}
      <Slider
        value={normalizedValue}
        onChange={(nextValue) => {
          if (typeof nextValue === "number") {
            onChange(nextValue);
          }
        }}
        disabled={disabled === true}
        min={sliderMin}
        max={sliderMax}
        step={stepValue}
        aria-labelledby={ariaLabelledBy}
        {...describedByProperties}
      />
      {unit}
    </div>
  );
}
