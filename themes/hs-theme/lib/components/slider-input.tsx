import { useId } from "react";
import "./slider-input.css";

export type SliderInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  disabled?: boolean | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  lowerLabel?: string | undefined;
  upperLabel?: string | undefined;
};

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  lowerLabel,
  upperLabel,
}: SliderInputProps) {
  const generatedId = useId();
  const sliderMin = typeof min === "number" ? min : 0;
  const sliderMax = typeof max === "number" ? max : sliderMin + 100;
  const normalizedValue = clamp(
    typeof value === "number" ? value : sliderMin,
    sliderMin,
    sliderMax,
  );

  return (
    <div className="af-slider" data-disabled={disabled ? "true" : "false"}>
      <div className="af-slider-track">
        <input
          id={generatedId}
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={step || 1}
          value={normalizedValue}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            onChange(Number.isNaN(nextValue) ? null : nextValue);
          }}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        />
        <div className="af-slider-value" aria-hidden="true">
          {value ?? "—"}
        </div>
      </div>
      <div className="af-slider-labels" aria-hidden="true">
        <span>{lowerLabel ?? sliderMin}</span>
        <span>{upperLabel ?? sliderMax}</span>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
