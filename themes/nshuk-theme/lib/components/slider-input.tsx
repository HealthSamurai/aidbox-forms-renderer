import { useId } from "react";
import type { SliderInputProps } from "@aidbox-forms/theme";

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
}: SliderInputProps) {
  const generatedId = useId();
  const unitId = unitLabel ? `${generatedId}-unit` : undefined;
  const hintId =
    lowerLabel || upperLabel ? `${generatedId}-range-hint` : undefined;
  const describedBy =
    [ariaDescribedBy, unitId, hintId].filter(Boolean).join(" ").trim() ||
    undefined;

  return (
    <div className="nhsuk-form-group">
      <input
        className="nhsuk-input"
        type="range"
        value={value ?? 0}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? null : Number(raw));
        }}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
      />
      {unitLabel ? (
        <div className="nhsuk-hint" id={unitId}>
          {unitLabel}
        </div>
      ) : null}
      {(lowerLabel || upperLabel) && (
        <div className="nhsuk-hint" id={hintId}>
          {lowerLabel ?? ""} {upperLabel ? `— ${upperLabel}` : ""}
        </div>
      )}
    </div>
  );
}
