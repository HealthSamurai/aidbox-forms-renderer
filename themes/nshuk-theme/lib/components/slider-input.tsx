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
  return (
    <div>
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
        aria-describedby={ariaDescribedBy}
      />
      {(lowerLabel || upperLabel) && (
        <div className="nhsuk-hint">
          {lowerLabel ?? ""} {upperLabel ? `— ${upperLabel}` : ""}
        </div>
      )}
    </div>
  );
}
