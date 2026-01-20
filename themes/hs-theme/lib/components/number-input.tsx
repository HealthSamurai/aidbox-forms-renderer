import { styled } from "@linaria/react";
import type { NumberInputProperties } from "@formbox/theme";

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  min,
  max,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
}: NumberInputProperties) {
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const describedByValues = [ariaDescribedBy, unitId].filter(
    Boolean,
  ) as string[];
  const describedBy =
    describedByValues.length > 0 ? describedByValues.join(" ") : undefined;

  const solo = !unitLabel;
  return (
    <NumberInputShell data-has-unit={unitLabel ? "true" : "false"}>
      <Frame $solo={solo}>
        <Field
          id={id}
          type="number"
          value={value ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === "" ? undefined : Number(nextValue));
          }}
          disabled={disabled}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          $solo={solo}
        />
        {unitLabel && (
          <Unit id={unitId} aria-hidden="true">
            {unitLabel}
          </Unit>
        )}
      </Frame>
    </NumberInputShell>
  );
}

const NumberInputShell = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
`;

const Frame = styled.div<{ $solo: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  overflow: hidden;
  width: 100%;

  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
  }
`;

const Field = styled.input<{ $solo: boolean }>`
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  min-width: 0;
  flex: 1;
`;

const Unit = styled.span`
  padding: 0.5rem 0.75rem;
  background: #edf2f7;
  border-left: 1px solid #cbd5e0;
`;
