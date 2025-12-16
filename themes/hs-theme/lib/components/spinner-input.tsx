import { styled } from "@linaria/react";

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
    <Spinner data-disabled={disabled ? "true" : "false"}>
      <SpinnerButton
        type="button"
        onClick={() => handleAdjust(-1)}
        disabled={disabled}
        aria-label="Decrease value"
      >
        –
      </SpinnerButton>
      <SpinnerField
        type="number"
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
      <SpinnerButton
        type="button"
        onClick={() => handleAdjust(1)}
        disabled={disabled}
        aria-label="Increase value"
      >
        +
      </SpinnerButton>
    </Spinner>
  );
}

const Spinner = styled.div`
  display: inline-flex;
  align-items: stretch;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const SpinnerButton = styled.button`
  background: #edf2f7;
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SpinnerField = styled.input`
  border: none;
  padding: 0.5rem 0.75rem;
  width: 5rem;
`;
