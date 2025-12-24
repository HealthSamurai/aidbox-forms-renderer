import type { QuantityInputProps } from "@aidbox-forms/theme";

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
    <div className="nhsuk-form-group" data-disabled={disabled || undefined}>
      <div
        className="nhsuk-input__wrapper"
        style={{ display: "flex", gap: "0.5rem" }}
      >
        <input
          id={inputId}
          className="nhsuk-input"
          type="number"
          value={value ?? ""}
          step="any"
          onChange={(event) => onChangeValue(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          placeholder={placeholder}
        />
        {isUnitFreeForm ? (
          <input
            className="nhsuk-input"
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
            className="nhsuk-select"
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
