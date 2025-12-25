import type { IAnswerInstance } from "../../../../../types.ts";
import { useTheme } from "../../../../../ui/theme.tsx";

export type QuantityInputProps = {
  answer: IAnswerInstance<"quantity">;
  inputId: string;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function QuantityInput({
  answer,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: QuantityInputProps) {
  const { InputGroup, NumberInput, SelectInput, TextInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.displayUnitKey;
  const inputBaseId = inputId;
  const resolvedLabelId = labelId ?? inputBaseId;
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
        ariaLabelledBy={resolvedLabelId}
        ariaDescribedBy={describedById}
        value={answer.value?.value ?? null}
        onChange={handleValueChange}
        disabled={disabled}
        placeholder={placeholder}
        step="any"
      />
      {answer.quantity.isUnitFreeForm ? (
        <TextInput
          id={unitInputId}
          ariaLabelledBy={resolvedLabelId}
          ariaDescribedBy={describedById}
          value={unitValue}
          onChange={(text) => answer.quantity.handleFreeTextChange(text)}
          disabled={disabled}
          placeholder="unit"
        />
      ) : (
        <SelectInput
          options={answer.quantity.entries}
          selectValue={unitValue}
          legacyOption={null}
          onChange={(key) => answer.quantity.handleSelectChange(key)}
          inputId={unitInputId}
          labelId={resolvedLabelId}
          describedById={describedById}
          readOnly={Boolean(disabled)}
        />
      )}
    </InputGroup>
  );
}
