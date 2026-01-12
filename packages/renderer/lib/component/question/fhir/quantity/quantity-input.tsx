import { observer } from "mobx-react-lite";

import type { IAnswer } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";
import { buildId } from "../../../../utilities.ts";

export type QuantityInputProperties = {
  answer: IAnswer<"quantity">;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

// todo: avoid direct access to answer
export const QuantityInput = observer(function QuantityInput({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: QuantityInputProperties) {
  const { InputGroup, NumberInput, SelectInput, TextInput } = useTheme();
  const { min, max } = answer.bounds;

  const handleValueChange = (nextValue: number | undefined) => {
    answer.quantity.handleNumberInput(
      nextValue === undefined ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup layout="row" weights={[2, 1]}>
      <NumberInput
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={answer.value?.value ?? undefined}
        onChange={handleValueChange}
        disabled={disabled}
        placeholder={placeholder ?? strings.inputs.quantityValuePlaceholder}
        step="any"
        min={min?.value}
        max={max?.value}
      />
      {answer.quantity.isUnitFreeForm ? (
        <TextInput
          id={buildId(id, "unit")}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          value={answer.value?.unit ?? ""}
          onChange={(text) => answer.quantity.handleFreeTextChange(text)}
          disabled={disabled}
          placeholder={strings.inputs.quantityUnitPlaceholder}
        />
      ) : (
        <SelectInput
          options={answer.quantity.entries}
          selectedOption={answer.quantity.entries.find(
            (entry) => entry.token === answer.quantity.unitToken,
          )}
          onChange={(token) => answer.quantity.handleSelectChange(token ?? "")}
          id={buildId(id, "unit")}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          disabled={Boolean(disabled)}
        />
      )}
    </InputGroup>
  );
});
