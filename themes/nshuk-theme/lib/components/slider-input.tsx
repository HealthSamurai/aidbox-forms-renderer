import type { SliderInputProperties } from "@aidbox-forms/theme";
import { hasErrorId } from "../utils/aria.ts";

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
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const hintId = lowerLabel || upperLabel ? `${id}-range-hint` : undefined;
  const describedBy =
    [ariaDescribedBy, unitId, hintId].filter(Boolean).join(" ").trim() ||
    undefined;
  const className = hasErrorId(describedBy)
    ? "nhsuk-input nhsuk-input--error"
    : "nhsuk-input";

  return (
    <div className="nhsuk-form-group">
      <input
        id={id}
        className={className}
        type="range"
        value={value ?? 0}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
      />
      {unitLabel && (
        <div className="nhsuk-hint" id={unitId}>
          {unitLabel}
        </div>
      )}
      {(lowerLabel || upperLabel) && (
        <div className="nhsuk-hint" id={hintId}>
          {lowerLabel ?? ""} {upperLabel ? `— ${upperLabel}` : ""}
        </div>
      )}
    </div>
  );
}
