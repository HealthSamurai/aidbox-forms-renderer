import type { IAnswerInstance } from "../../../../../types.ts";
import { useTheme } from "../../../../../ui/theme.tsx";

export type QuantityInputProps = {
  answer: IAnswerInstance<"quantity">;
  id: string;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function QuantityInput({
  answer,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: QuantityInputProps) {
  const { InputGroup, NumberInput, SelectInput, TextInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.displayUnitToken;
  const inputBaseId = id;
  const resolvedAriaLabelledBy = ariaLabelledBy ?? inputBaseId;
  const unitInputId = `${inputBaseId}-unit`;

  const handleValueChange = (nextValue: number | null) => {
    answer.quantity.handleNumberInput(
      nextValue === null ? "" : String(nextValue),
    );
  };

  return (
    <InputGroup layout="row" weights={[2, 1]}>
      <NumberInput
        id={id}
        ariaLabelledBy={resolvedAriaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        value={answer.value?.value ?? null}
        onChange={handleValueChange}
        disabled={disabled}
        placeholder={placeholder}
        step="any"
      />
      {answer.quantity.isUnitFreeForm ? (
        <TextInput
          id={unitInputId}
          ariaLabelledBy={resolvedAriaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          value={unitValue}
          onChange={(text) => answer.quantity.handleFreeTextChange(text)}
          disabled={disabled}
          placeholder="unit"
        />
      ) : (
        <SelectInput
          options={answer.quantity.entries}
          token={unitValue}
          legacyOption={null}
          onChange={(token) => answer.quantity.handleSelectChange(token)}
          id={unitInputId}
          ariaLabelledBy={resolvedAriaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          disabled={Boolean(disabled)}
        />
      )}
    </InputGroup>
  );
}
