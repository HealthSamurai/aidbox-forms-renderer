import { useTheme } from "../../../../../ui/theme.tsx";

export type IntegerInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  inputId?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
};

export function IntegerInput({
  value,
  onChange,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  unitLabel,
}: IntegerInputProps) {
  const { NumberInput: ThemedNumberInput } = useTheme();
  return (
    <ThemedNumberInput
      id={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value ?? null}
      onChange={(next) => onChange(next != null ? Math.round(next) : null)}
      disabled={disabled}
      step={1}
      unitLabel={unitLabel}
    />
  );
}
