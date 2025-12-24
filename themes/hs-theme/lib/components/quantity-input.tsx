import { styled } from "@linaria/react";
import { inputClass } from "./tokens.ts";

export type QuantityUnitOption = {
  key: string;
  label: string;
  disabled?: boolean | undefined;
};

export type QuantityInputProps = {
  value: number | null;
  onChangeValue: (raw: string) => void;
  unitOptions: ReadonlyArray<QuantityUnitOption>;
  unitValue: string;
  onSelectUnit: (key: string) => void;
  onChangeFreeTextUnit: (text: string) => void;
  isUnitFreeForm: boolean;
  inputId?: string | undefined;
  placeholder?: string | undefined;
  unitPlaceholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export function QuantityInput({
  value,
  onChangeValue,
  unitOptions,
  unitValue,
  onSelectUnit,
  onChangeFreeTextUnit,
  isUnitFreeForm,
  inputId,
  placeholder,
  unitPlaceholder = "unit",
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: QuantityInputProps) {
  const describedBy = ariaDescribedBy ?? undefined;

  return (
    <QuantityWrapper>
      <ValueSlot>
        <input
          id={inputId}
          className={inputClass}
          type="number"
          value={value ?? ""}
          step="any"
          onChange={(event) => onChangeValue(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          placeholder={placeholder}
        />
      </ValueSlot>
      <UnitSlot>
        {isUnitFreeForm ? (
          <input
            className={inputClass}
            type="text"
            value={unitValue}
            onChange={(event) => onChangeFreeTextUnit(event.target.value)}
            placeholder={unitPlaceholder}
            disabled={disabled}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          />
        ) : (
          <select
            className={inputClass}
            value={unitValue}
            onChange={(event) => onSelectUnit(event.target.value)}
            disabled={disabled}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          >
            <option value="">Select a unit</option>
            {unitOptions.map((option) => (
              <option
                key={option.key}
                value={option.key}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        )}
      </UnitSlot>
    </QuantityWrapper>
  );
}

const QuantityWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ValueSlot = styled.div`
  flex: 2 1 0;
`;

const UnitSlot = styled.div`
  flex: 1 1 0;
`;
