import { observer } from "mobx-react-lite";
import type { ValueControlProps } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { getNumericValue } from "../../../../utils.ts";
import { strings } from "../../../../strings.ts";

export const QuantitySpinnerControl = observer(function QuantitySpinnerControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProps<"quantity">) {
  const { InputGroup, SpinnerInput, SelectInput, TextInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.displayUnitToken;
  const selectedUnit =
    answer.quantity.entries.find((entry) => entry.token === unitValue) ?? null;
  const { min, max } = answer.bounds;
  const disabled = answer.question.readOnly;
  const valuePlaceholder =
    answer.question.placeholder ?? strings.inputs.quantityValuePlaceholder;

  const handleValueChange = (nextValue: number | null) => {
    answer.quantity.handleNumberInput(
      nextValue === null ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup layout="row" weights={[2, 1]}>
      <SpinnerInput
        value={getNumericValue(answer.value)}
        onChange={handleValueChange}
        min={getNumericValue(min) ?? undefined}
        max={getNumericValue(max) ?? undefined}
        step={0.1}
        disabled={disabled}
        placeholder={valuePlaceholder}
        ariaLabelledBy={ariaLabelledBy ?? id}
        ariaDescribedBy={ariaDescribedBy}
      />
      {answer.quantity.isUnitFreeForm ? (
        <TextInput
          id={`${id}_/_unit`}
          ariaLabelledBy={ariaLabelledBy ?? id}
          ariaDescribedBy={ariaDescribedBy}
          value={unitValue}
          onChange={(text) => answer.quantity.handleFreeTextChange(text)}
          disabled={disabled}
          placeholder={strings.inputs.quantityUnitPlaceholder}
        />
      ) : (
        <SelectInput
          options={answer.quantity.entries}
          selectedOption={selectedUnit}
          onChange={(token) => answer.quantity.handleSelectChange(token ?? "")}
          id={`${id}_/_unit`}
          ariaLabelledBy={ariaLabelledBy ?? id}
          ariaDescribedBy={ariaDescribedBy}
          disabled={disabled}
        />
      )}
    </InputGroup>
  );
});
