import type { SpinnerInputProps } from "@aidbox-forms/theme";

export function SpinnerInput({
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
}: SpinnerInputProps) {
  return (
    <input
      className="nhsuk-input"
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === "" ? null : Number(raw));
      }}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
