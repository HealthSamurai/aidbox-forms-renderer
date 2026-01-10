import { styled } from "@linaria/react";
import { useId, useRef } from "react";
import type { SliderInputProperties } from "@aidbox-forms/theme";
import { clamp, useIsWithinGap } from "./utilities.ts";

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
}: SliderInputProperties) {
  const generatedId = useId();
  const sliderMin = typeof min === "number" ? min : 0;
  const sliderMax = typeof max === "number" ? max : sliderMin + 100;
  const normalizedValue = clamp(
    typeof value === "number" ? value : sliderMin,
    sliderMin,
    sliderMax,
  );
  const sliderRange = sliderMax - sliderMin;
  const valuePercent =
    sliderRange > 0 ? ((normalizedValue - sliderMin) / sliderRange) * 100 : 0;
  const clampedPercent = clamp(valuePercent, 0, 100);
  const unitId = unitLabel ? `${generatedId}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId]
    .filter(Boolean)
    .join(" ")
    .trim();

  const labelsReference = useRef<HTMLDivElement | null>(null);
  const valueReference = useRef<HTMLDivElement | null>(null);
  const lowerReference = useRef<HTMLDivElement | null>(null);
  const upperReference = useRef<HTMLDivElement | null>(null);
  const isLowerClose = useIsWithinGap(
    labelsReference,
    valueReference,
    lowerReference,
    8,
  );
  const isUpperClose = useIsWithinGap(
    labelsReference,
    valueReference,
    upperReference,
    8,
  );

  const unit = Boolean(unitLabel) && <Unit id={unitId}>{unitLabel}</Unit>;

  return (
    <Wrapper data-disabled={disabled ? "true" : "false"}>
      <Slider
        id={generatedId}
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={step || 1}
        value={normalizedValue}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isNaN(nextValue) ? undefined : nextValue);
        }}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy.length > 0 ? describedBy : undefined}
      />
      <Labels aria-hidden="true" ref={labelsReference}>
        <Value aria-hidden="true" $left={clampedPercent} ref={valueReference}>
          {value} {unit}
        </Value>
        <div ref={lowerReference} data-hidden={isLowerClose ? "true" : "false"}>
          {lowerLabel ?? (
            <>
              {sliderMin} {unit}
            </>
          )}
        </div>
        <div ref={upperReference} data-hidden={isUpperClose ? "true" : "false"}>
          {upperLabel ?? (
            <>
              {sliderMax} {unit}
            </>
          )}
        </div>
      </Labels>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const Slider = styled.input`
  width: 100%;
  display: block;
`;

const Value = styled.div<{ $left: number }>`
  position: absolute;
  left: ${(properties) => `${properties.$left}%`};
  top: 0;
  transform: ${(properties) => `translate(-${properties.$left}%, 0)`};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
`;

const Labels = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4a5568;
  width: 100%;

  & [data-hidden="true"] {
    visibility: hidden;
  }
`;

const Unit = styled.span`
  color: #4a5568;
  font-size: 0.875rem;
`;
