import type { IAnswerInstance } from "../../../../../types.ts";
import { useTheme } from "../../../../../ui/theme.tsx";

export type QuantityInputProps = {
  answer: IAnswerInstance<"quantity">;
  inputId: string;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function QuantityInput({
  answer,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: QuantityInputProps) {
  const { InputGroup, NumberInput, SelectInput, TextInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.displayUnitKey;
  const inputBaseId = inputId;
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
        id={inputId}
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
          value={unitValue}
          legacyOption={null}
          onChange={(key) => answer.quantity.handleSelectChange(key)}
          id={unitInputId}
          ariaLabelledBy={resolvedAriaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
          disabled={Boolean(disabled)}
        />
      )}
    </InputGroup>
  );
}
