import { useId } from "react";
import { styled } from "@linaria/react";
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
  unitLabel,
}: SpinnerInputProps) {
  const generatedId = useId();
  const unitId = unitLabel ? `${generatedId}-unit` : undefined;
  const describedBy =
    [ariaDescribedBy, unitId].filter(Boolean).join(" ").trim() || undefined;

  return (
    <div className="nhsuk-form-group">
      <SpinnerRow>
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
          aria-describedby={describedBy}
        />
        {unitLabel ? <UnitLabel id={unitId}>{unitLabel}</UnitLabel> : null}
      </SpinnerRow>
    </div>
  );
}

const SpinnerRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnitLabel = styled.span`
  padding: 0.45rem 0.75rem;
  background: #f0f4f5;
  border-radius: 0.25rem;
`;
