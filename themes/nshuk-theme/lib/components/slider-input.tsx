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
}: SliderInputProps) {
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

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
      {(lowerLabel || upperLabel) && (
        <div className="nhsuk-hint">
          {lowerLabel ?? ""} {upperLabel ? `— ${upperLabel}` : ""}
        </div>
      )}
    </div>
  );
}
