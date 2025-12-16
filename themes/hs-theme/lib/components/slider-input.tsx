import { styled } from "@linaria/react";
import { useId } from "react";

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
    <SliderShell data-disabled={disabled ? "true" : "false"}>
      <SliderTrack>
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
        <SliderValue aria-hidden="true">{value ?? "—"}</SliderValue>
      </SliderTrack>
      <SliderLabels aria-hidden="true">
        <span>{lowerLabel ?? sliderMin}</span>
        <span>{upperLabel ?? sliderMax}</span>
      </SliderLabels>
    </SliderShell>
  );
}

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

const SliderShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SliderValue = styled.div`
  min-width: 2rem;
  text-align: right;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4a5568;
`;
