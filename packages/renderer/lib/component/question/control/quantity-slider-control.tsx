import { observer } from "mobx-react-lite";
import type { ValueControlProperties } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import {
  getNumericValue,
  getSliderStepValue,
  buildId,
} from "../../../utilities.ts";
import { strings } from "../../../strings.ts";

export const QuantitySliderControl = observer(function QuantitySliderControl({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"quantity">) {
  const { InputGroup, SliderInput, SelectInput, TextInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.unitToken;
  const selectedUnit =
    answer.quantity.entries.find((entry) => entry.token === unitValue) ??
    undefined;
  const { min, max } = answer.bounds;
  const step = getSliderStepValue(answer.question.template) ?? 0.1;
  const disabled = answer.question.readOnly;

  const handleValueChange = (nextValue: number | undefined) => {
    answer.quantity.handleNumberInput(
      nextValue === undefined ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup layout="row" weights={[2, 1]}>
      <SliderInput
        value={getNumericValue(answer.value)}
        onChange={handleValueChange}
        min={getNumericValue(min) ?? undefined}
        max={getNumericValue(max) ?? undefined}
        step={step}
        disabled={disabled}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        lowerLabel={answer.question.lower}
        upperLabel={answer.question.upper}
        unitLabel={answer.value?.unit}
      />
      {answer.quantity.isUnitFreeForm ? (
        <TextInput
          id={buildId(id, "unit")}
          ariaLabelledBy={ariaLabelledBy}
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
          id={buildId(id, "unit")}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          disabled={disabled}
        />
      )}
    </InputGroup>
  );
});
