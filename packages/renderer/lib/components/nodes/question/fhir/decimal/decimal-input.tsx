import { useTheme } from "../../../../../ui/theme.tsx";

export type DecimalInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
};

export function DecimalInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
  unitLabel,
}: DecimalInputProps) {
  const { NumberInput: ThemedNumberInput } = useTheme();
  return (
    <ThemedNumberInput
      id={inputId}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      placeholder={placeholder}
      value={value ?? null}
      onChange={onChange}
      disabled={disabled}
      step="any"
      unitLabel={unitLabel}
    />
  );
}
