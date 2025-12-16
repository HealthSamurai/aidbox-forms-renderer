import { styled } from "@linaria/react";
import type { NumberInputProps } from "@aidbox-forms/theme";

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
}: NumberInputProps) {
  const described = [ariaDescribedBy].filter(Boolean).join(" ").trim();
  const describedBy = described.length > 0 ? described : undefined;

  return (
    <div className="nhsuk-form-group">
      {unitLabel ? (
        <UnitWrapper>
          <input
            id={id}
            list={list}
            className="nhsuk-input"
            type="number"
            value={value ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              onChange(raw === "" ? null : Number(raw));
            }}
            disabled={disabled}
            placeholder={placeholder}
            step={step}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={
              [describedBy, unitLabel ? `${id}-unit` : undefined]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
          <UnitLabel id={id ? `${id}-unit` : undefined} aria-hidden="true">
            {unitLabel}
          </UnitLabel>
        </UnitWrapper>
      ) : (
        <input
          id={id}
          list={list}
          className="nhsuk-input"
          type="number"
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === "" ? null : Number(raw));
          }}
          disabled={disabled}
          placeholder={placeholder}
          step={step}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
        />
      )}
    </div>
  );
}

const UnitWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const UnitLabel = styled.span`
  padding: 0.55rem 0.75rem;
`;
