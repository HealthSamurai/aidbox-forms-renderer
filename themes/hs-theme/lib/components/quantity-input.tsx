import "./quantity-input.css";
import "./text-input.css";

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
  list?: string | undefined;
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
  list,
  placeholder,
  unitPlaceholder = "unit",
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: QuantityInputProps) {
  const describedBy = ariaDescribedBy ?? undefined;

  return (
    <div className="af-quantity-input">
      <div className="af-quantity-input__value">
        <input
          id={inputId}
          list={list}
          className="af-input"
          type="number"
          value={value ?? ""}
          step="any"
          onChange={(event) => onChangeValue(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          placeholder={placeholder}
        />
      </div>
      <div className="af-quantity-input__unit">
        {isUnitFreeForm ? (
          <input
            className="af-input"
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
            className="af-input"
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
      </div>
    </div>
  );
}
