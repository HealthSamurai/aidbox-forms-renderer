import { observer } from "mobx-react-lite";
import { useStrings } from "@formbox/theme";
import type { ValueControlProperties } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { getNumericValue, buildId } from "../../../utilities.ts";
import { QuantityUnitInput } from "../fhir/quantity/quantity-unit-input.tsx";

export const QuantitySpinnerControl = observer(function QuantitySpinnerControl({
  answer,
  path,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
}: ValueControlProperties<"quantity">) {
  const strings = useStrings();
  const { InputGroup, SpinnerInput } = useTheme();
  const { min, max } = answer.bounds;
  const disabled = answer.question.readOnly;
  const valuePlaceholder =
    answer.question.placeholder ?? strings.inputs.quantityValuePlaceholder;

  const handleValueChange = (nextValue: number | undefined) => {
    answer.quantity.handleNumberInput(
      nextValue === undefined ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup spans={[8, 4]}>
      <SpinnerInput
        id={id}
        path={path}
        value={getNumericValue(answer.value)}
        onChange={handleValueChange}
        min={getNumericValue(min) ?? undefined}
        max={getNumericValue(max) ?? undefined}
        step={0.1}
        disabled={disabled}
        placeholder={valuePlaceholder}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
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
