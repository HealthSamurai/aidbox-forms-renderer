import { styled } from "@linaria/react";
import { useId } from "react";
import type { SliderInputProps } from "@aidbox-forms/theme";

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
  unitLabel,
}: SliderInputProps) {
  const generatedId = useId();
  const sliderMin = typeof min === "number" ? min : 0;
  const sliderMax = typeof max === "number" ? max : sliderMin + 100;
  const normalizedValue = clamp(
    typeof value === "number" ? value : sliderMin,
    sliderMin,
    sliderMax,
  );
  const unitId = unitLabel ? `${generatedId}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId]
    .filter(Boolean)
    .join(" ")
    .trim();

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
          aria-describedby={describedBy.length > 0 ? describedBy : undefined}
        />
        <ValueWrap aria-hidden="true">
          <SliderValue>{value ?? "—"}</SliderValue>
          {unitLabel ? <Unit id={unitId}>{unitLabel}</Unit> : null}
        </ValueWrap>
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

const ValueWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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

const Unit = styled.span`
  color: #4a5568;
  font-size: 0.875rem;
`;
