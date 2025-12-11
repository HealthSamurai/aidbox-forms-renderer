import "./spinner-input.css";

export type SpinnerInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  disabled?: boolean | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
};

export function SpinnerInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
}: SpinnerInputProps) {
  const handleAdjust = (direction: 1 | -1) => {
    if (disabled) return;
    const current = value ?? 0;
    const next = current + direction * step;
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

  return (
    <div className="af-spinner" data-disabled={disabled ? "true" : "false"}>
      <button
        type="button"
        className="af-spinner-btn"
        onClick={() => handleAdjust(-1)}
        disabled={disabled}
        aria-label="Decrease value"
      >
        –
      </button>
      <input
        type="number"
        className="af-spinner-input"
        value={value ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "") {
            onChange(null);
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
        aria-describedby={ariaDescribedBy}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="af-spinner-btn"
        onClick={() => handleAdjust(1)}
        disabled={disabled}
        aria-label="Increase value"
      >
        +
      </button>
    </div>
  );
}
