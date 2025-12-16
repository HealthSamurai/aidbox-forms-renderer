import type { IAnswerInstance } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export type QuantityInputProps = {
  answer: IAnswerInstance<"quantity">;
  inputId: string;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  list?: string | undefined;
};

export function QuantityInput({
  answer,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
  list,
}: QuantityInputProps) {
  const { QuantityInput: ThemedQuantityInput } = useTheme();
  const unitValue = answer.quantity.isUnitFreeForm
    ? (answer.value?.unit ?? "")
    : answer.quantity.displayUnitKey;

  return (
    <ThemedQuantityInput
      inputId={inputId}
      list={list}
      disabled={disabled}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      value={answer.value?.value ?? null}
      onChangeValue={(raw) => answer.quantity.handleNumberInput(raw)}
      unitOptions={answer.quantity.entries}
      unitValue={unitValue}
      onSelectUnit={(key) => answer.quantity.handleSelectChange(key)}
      onChangeFreeTextUnit={(text) =>
        answer.quantity.handleFreeTextChange(text)
      }
      isUnitFreeForm={answer.quantity.isUnitFreeForm}
      placeholder={placeholder}
    />
  );
}
