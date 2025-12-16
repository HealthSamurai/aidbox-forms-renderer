import { styled } from "@linaria/react";
import { useId } from "react";

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
  list,
}: {
  id?: string | undefined;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  unitLabel?: string | undefined;
  list?: string | undefined;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const unitId = unitLabel ? `${inputId}-unit` : undefined;
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
          id={inputId}
          list={list}
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const t = e.target.value;
            onChange(t === "" ? null : Number(t));
          }}
          disabled={disabled}
          placeholder={placeholder}
          step={step}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          $solo={solo}
        />
        {unitLabel ? (
          <Unit id={unitId} aria-hidden="true">
            {unitLabel}
          </Unit>
        ) : null}
      </Frame>
    </NumberInputShell>
  );
}

const NumberInputShell = styled.div`
  display: inline-flex;
  align-items: stretch;
`;

const Frame = styled.div<{ $solo: boolean }>`
  display: inline-flex;
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  overflow: hidden;
  ${({ $solo }) => ($solo ? "width: 100%;" : "")}
`;

const Field = styled.input<{ $solo: boolean }>`
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  min-width: 6rem;
  ${({ $solo }) => ($solo ? "width: 100%;" : "")}
`;

const Unit = styled.span`
  padding: 0.5rem 0.75rem;
  background: #edf2f7;
  border-left: 1px solid #cbd5e0;
`;
