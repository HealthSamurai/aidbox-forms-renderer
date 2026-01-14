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
    <Wrapper data-disabled={disabled ? "true" : "false"}>
      <Slider
        id={id}
        className={className}
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
  --nhsuk-slider-track-size: var(--nhsuk-spacing-2);
  --nhsuk-slider-thumb-size: calc(
    var(--nhsuk-spacing-4) + var(--nhsuk-spacing-1)
  );
  --nhsuk-slider-thumb-dash-width: var(--nhsuk-border-width-form-element);
  --nhsuk-slider-thumb-dash-gap: calc(
    var(--nhsuk-border-width-form-element) + 1px
  );
  --nhsuk-slider-thumb-dash-offset: calc(
    var(--nhsuk-slider-thumb-dash-gap) / 2
  );
  --nhsuk-slider-thumb-dash-edge: calc(
    var(--nhsuk-slider-thumb-dash-offset) + var(--nhsuk-slider-thumb-dash-width)
  );
  --nhsuk-slider-thumb-dash-inset: var(--nhsuk-spacing-1);

  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  padding-top: calc(var(--nhsuk-spacing-2) + 2px);
  padding-bottom: calc(var(--nhsuk-spacing-2) - 2px);

  &::-webkit-slider-runnable-track {
    background: var(--nhsuk-border-colour);
    border-radius: 0;
    height: var(--nhsuk-slider-track-size);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    background-color: var(--nhsuk-secondary-button-hover-colour);
    background-image: linear-gradient(
      90deg,
      transparent calc(50% - var(--nhsuk-slider-thumb-dash-edge)),
      currentColor calc(50% - var(--nhsuk-slider-thumb-dash-edge)),
      currentColor calc(50% - var(--nhsuk-slider-thumb-dash-offset)),
      transparent calc(50% - var(--nhsuk-slider-thumb-dash-offset)),
      transparent calc(50% + var(--nhsuk-slider-thumb-dash-offset)),
      currentColor calc(50% + var(--nhsuk-slider-thumb-dash-offset)),
      currentColor calc(50% + var(--nhsuk-slider-thumb-dash-edge)),
      transparent calc(50% + var(--nhsuk-slider-thumb-dash-edge))
    );
    background-repeat: no-repeat;
    background-size: 100%
      calc(100% - (var(--nhsuk-slider-thumb-dash-inset) * 2));
    background-position: center;
    border: 2px solid var(--nhsuk-secondary-button-border-colour);
    border-radius: 2px;
    box-shadow: 0 4px 0 var(--nhsuk-secondary-button-shadow-colour);
    color: var(--nhsuk-secondary-button-border-colour);
    height: calc(var(--nhsuk-slider-thumb-size) - 2px);
    margin-top: calc(
      (var(--nhsuk-slider-thumb-size) - var(--nhsuk-slider-track-size)) / -2 -
        2px
    );
    width: var(--nhsuk-slider-thumb-size);
  }

  &::-moz-range-track {
    background: var(--nhsuk-border-colour);
    border-radius: 0;
    height: var(--nhsuk-slider-track-size);
  }

  &::-moz-range-thumb {
    background-color: var(--nhsuk-secondary-button-hover-colour);
    background-image: linear-gradient(
      90deg,
      transparent calc(50% - var(--nhsuk-slider-thumb-dash-edge)),
      currentColor calc(50% - var(--nhsuk-slider-thumb-dash-edge)),
      currentColor calc(50% - var(--nhsuk-slider-thumb-dash-offset)),
      transparent calc(50% - var(--nhsuk-slider-thumb-dash-offset)),
      transparent calc(50% + var(--nhsuk-slider-thumb-dash-offset)),
      currentColor calc(50% + var(--nhsuk-slider-thumb-dash-offset)),
      currentColor calc(50% + var(--nhsuk-slider-thumb-dash-edge)),
      transparent calc(50% + var(--nhsuk-slider-thumb-dash-edge))
    );
    background-repeat: no-repeat;
    background-size: 100%
      calc(100% - (var(--nhsuk-slider-thumb-dash-inset) * 2));
    background-position: center;
    border: 2px solid var(--nhsuk-secondary-button-border-colour);
    border-radius: 2px;
    box-shadow: 0 4px 0 var(--nhsuk-secondary-button-shadow-colour);
    color: var(--nhsuk-secondary-button-border-colour);
    height: calc(var(--nhsuk-slider-thumb-size) - 2px);
    width: var(--nhsuk-slider-thumb-size);
  }

  &:hover::-webkit-slider-thumb {
    background-color: var(--nhsuk-secondary-button-hover-colour);
  }

  &:hover::-moz-range-thumb {
    background-color: var(--nhsuk-secondary-button-hover-colour);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible::-webkit-slider-thumb,
  &:focus::-webkit-slider-thumb {
    background-color: var(--nhsuk-focus-colour);
    border: none;
    box-shadow: 0 4px 0 var(--nhsuk-black-colour);
    color: var(--nhsuk-black-colour);
  }

  &:focus-visible::-moz-range-thumb,
  &:focus::-moz-range-thumb {
    background-color: var(--nhsuk-focus-colour);
    border: none;
    box-shadow: 0 4px 0 var(--nhsuk-black-colour);
    color: var(--nhsuk-black-colour);
  }

  &:active::-webkit-slider-thumb,
  &:active:focus::-webkit-slider-thumb,
  &:active:focus-visible::-webkit-slider-thumb {
    background-color: var(--nhsuk-secondary-button-hover-colour);
    border: 2px solid var(--nhsuk-secondary-button-border-colour);
    box-shadow: 0 2px 0 var(--nhsuk-secondary-button-shadow-colour);
    color: var(--nhsuk-secondary-button-border-colour);
    transform: translateY(2px);
  }

  &:active::-moz-range-thumb,
  &:active:focus::-moz-range-thumb,
  &:active:focus-visible::-moz-range-thumb {
    background-color: var(--nhsuk-secondary-button-hover-colour);
    border: 2px solid var(--nhsuk-secondary-button-border-colour);
    box-shadow: 0 2px 0 var(--nhsuk-secondary-button-shadow-colour);
    color: var(--nhsuk-secondary-button-border-colour);
    transform: translateY(2px);
  }
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
