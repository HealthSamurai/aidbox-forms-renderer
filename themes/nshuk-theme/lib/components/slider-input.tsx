import { styled } from "@linaria/react";
import { useRef } from "react";
import type { SliderInputProperties } from "@aidbox-forms/theme";
import { hasErrorId } from "../utils/aria.ts";
import { clamp, useIsWithinGap } from "./utilities.ts";

export function SliderInput({
  id,
  value,
  onChange,
  disabled,
  min,
  max,
  step = 1,
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
  const sliderRange = sliderMax - sliderMin;
  const valuePercent =
    sliderRange > 0 ? ((normalizedValue - sliderMin) / sliderRange) * 100 : 0;
  const clampedPercent = clamp(valuePercent, 0, 100);
  const describedBy = ariaDescribedBy?.trim() || undefined;
  const className = hasErrorId(describedBy) ? "nhsuk-input--error" : undefined;
  const displayValue = value ?? normalizedValue;

  const labelsReference = useRef<HTMLDivElement | null>(null);
  const valueReference = useRef<HTMLDivElement | null>(null);
  const lowerReference = useRef<HTMLDivElement | null>(null);
  const upperReference = useRef<HTMLDivElement | null>(null);
  const isLowerClose = useIsWithinGap(
    labelsReference,
    valueReference,
    lowerReference,
    8,
    [displayValue],
  );
  const isUpperClose = useIsWithinGap(
    labelsReference,
    valueReference,
    upperReference,
    8,
    [displayValue],
  );

  const unit = unitLabel ? <Unit>{unitLabel}</Unit> : undefined;

  return (
    <Wrapper
      className="ab-nhsuk-input-like"
      data-disabled={disabled ? "true" : "false"}
    >
      <Slider
        id={id}
        className={[className, "ab-nhsuk-slider"].filter(Boolean).join(" ")}
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
        aria-describedby={describedBy}
      />
      <Labels aria-hidden="true" ref={labelsReference}>
        <Value
          className="nhsuk-label"
          aria-hidden="true"
          $left={clampedPercent}
          ref={valueReference}
        >
          {displayValue} {unit}
        </Value>
        <Label
          className="nhsuk-label"
          ref={lowerReference}
          data-hidden={isLowerClose ? "true" : "false"}
        >
          {lowerLabel ?? (
            <>
              {sliderMin} {unit}
            </>
          )}
        </Label>
        <Label
          className="nhsuk-label"
          ref={upperReference}
          data-hidden={isUpperClose ? "true" : "false"}
        >
          {upperLabel ?? (
            <>
              {sliderMax} {unit}
            </>
          )}
        </Label>
      </Labels>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-1);
  width: 100%;
`;

const Slider = styled.input`
  width: 100%;
  display: block;
  padding: var(--nhsuk-spacing-2) 0;
`;

const Labels = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;

  & [data-hidden="true"] {
    visibility: hidden;
  }
`;

const Label = styled.div`
  white-space: nowrap;
`;

const Value = styled.div<{ $left: number }>`
  position: absolute;
  left: ${(properties) => `${properties.$left}%`};
  top: 0;
  transform: ${(properties) => `translate(-${properties.$left}%, 0)`};
  display: inline-flex;
  align-items: center;
  gap: var(--nhsuk-spacing-1);
  white-space: nowrap;
`;

const Unit = styled.span`
  color: var(--nhsuk-secondary-text-colour);
`;
