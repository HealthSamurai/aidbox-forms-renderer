import type { Coding, Quantity } from "fhir/r5";
import "./quantity-input.css";
import { useUnitCatalog } from "../questions/hooks/use-unit-catalog.ts";
import { useUnitSelectModel } from "../questions/hooks/use-unit-select-model.ts";
import { useUnitInteraction } from "../questions/hooks/use-unit-interaction.ts";

export function QuantityInput({
  value,
  onChange,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  unitOptions,
  inputId,
  list,
}: {
  value: Quantity | null;
  onChange: (next: Quantity | null) => void;
  disabled?: boolean | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  unitOptions: ReadonlyArray<Coding>;
  inputId: string;
  list?: string | undefined;
}) {
  const describedBy = ariaDescribedBy ?? undefined;

  const {
    optionEntries,
    getCodingForKey,
    getKeyForCoding,
    hasSingleUnit,
    singleUnitCoding,
  } = useUnitCatalog(unitOptions);

  const { selectOptions, firstEnabledOptionKey, getKeyForQuantity } =
    useUnitSelectModel(optionEntries, value, getKeyForCoding);

  const {
    displayKey,
    handleNumberChange,
    handleSelectChange,
    handleFreeTextChange,
  } = useUnitInteraction({
    value,
    onChange,
    hasSingleUnit,
    singleUnitCoding,
    firstEnabledOptionKey,
    getCodingForKey,
    getKeyForQuantity,
  });

  const isFreeFormUnit = selectOptions.length === 0;

  return (
    <div className="af-quantity-input">
      <div className="af-quantity-input__value">
        <input
          id={inputId}
          list={list}
          className="af-input"
          type="number"
          value={value?.value ?? ""}
          step="any"
          onChange={(event) => handleNumberChange(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
        />
      </div>
      <div className="af-quantity-input__unit">
        {!isFreeFormUnit ? (
          <select
            className="af-input"
            value={displayKey}
            onChange={(event) => handleSelectChange(event.target.value)}
            disabled={disabled}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          >
            <option value="">Select a unit</option>
            {selectOptions.map((option) => (
              <option
                key={option.key}
                value={option.key}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="af-input"
            type="text"
            value={value?.unit ?? ""}
            onChange={(event) => handleFreeTextChange(event.target.value)}
            placeholder="unit"
            disabled={disabled}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
          />
        )}
      </div>
    </div>
  );
}
