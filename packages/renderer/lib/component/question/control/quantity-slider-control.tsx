import { observer } from "mobx-react-lite";
import type { ValueControlProperties } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import {
  getNumericValue,
  getSliderStepValue,
  buildId,
} from "../../../utilities.ts";
import { QuantityUnitInput } from "../fhir/quantity/quantity-unit-input.tsx";

export const QuantitySliderControl = observer(function QuantitySliderControl({
  answer,
  path,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"quantity">) {
  const { InputGroup, SliderInput } = useTheme();
  const { min, max } = answer.bounds;
  const step = getSliderStepValue(answer.question.template) ?? 0.1;
  const disabled = answer.question.readOnly;

  const handleValueChange = (nextValue: number | undefined) => {
    answer.quantity.handleNumberInput(
      nextValue === undefined ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup spans={[8, 4]}>
      <SliderInput
        id={id}
        path={path}
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
      <QuantityUnitInput
        answer={answer}
        id={buildId(id, "unit")}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={disabled}
      />
    </InputGroup>
  );
});
