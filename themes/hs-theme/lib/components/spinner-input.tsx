import { styled } from "@linaria/react";
import type { SpinnerInputProperties } from "@formbox/theme";
import { Minus } from "../icons/minus.tsx";
import { Plus } from "../icons/plus.tsx";
import { getPrecision, roundToPrecision } from "./utilities.ts";

export function SpinnerInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  unitLabel,
}: SpinnerInputProperties) {
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleAdjust = (direction: 1 | -1) => {
    if (disabled) return;
    const current = value ?? 0;
    const safeStep = Number.isFinite(step) && step !== 0 ? step : 1;
    const precision = Math.max(getPrecision(safeStep), getPrecision(current));
    const next = roundToPrecision(current + direction * safeStep, precision);
    if (typeof min === "number" && next < min) {
      onChange(min);
      return;
    }
    if (typeof max === "number" && next > max) {
      onChange(max);
      return;
    }
    onChange(next);
  };

  const control = (
    <Spinner data-disabled={disabled ? "true" : "false"}>
      <SpinnerButton
        type="button"
        onClick={() => handleAdjust(-1)}
        disabled={disabled}
        aria-label="Decrease value"
      >
        <Minus size={14} />
      </SpinnerButton>
      <SpinnerField
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "") {
            onChange();
            return;
          }
          const parsed = Number(next);
          onChange(Number.isNaN(parsed) ? value : parsed);
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy.length > 0 ? describedBy : undefined}
        placeholder={placeholder}
      />
      <SpinnerButton
        type="button"
        onClick={() => handleAdjust(1)}
        disabled={disabled}
        aria-label="Increase value"
      >
        <Plus size={14} />
      </SpinnerButton>
    </Spinner>
  );

  if (!unitLabel) {
    return control;
  }

  return (
    <SpinnerShell>
      {control}
      <Unit id={unitId}>{unitLabel}</Unit>
    </SpinnerShell>
  );
}

const SpinnerShell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
`;

const Spinner = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  overflow: hidden;
  flex: 1;

  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
    outline: none;
  }
`;

const SpinnerButton = styled.button`
  border: none;
  padding: 0.5rem 0.5rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:active {
    background: #edf2f7;
  }
`;

const SpinnerField = styled.input`
  border: none;
  padding: 0.5rem 0.75rem;
  min-width: 0;
  width: 100%;
  flex: 1;
  appearance: none;

  &:focus {
    outline: none;
  }
`;

const Unit = styled.span`
  color: #4a5568;
  font-size: 0.9rem;
`;
