import { useTheme } from "../../../../../ui/theme.tsx";

export type DecimalInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
};

export function DecimalInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  unitLabel,
}: DecimalInputProps) {
  const { NumberInput: ThemedNumberInput } = useTheme();
  return (
    <ThemedNumberInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value ?? null}
      onChange={onChange}
      disabled={disabled}
      step="any"
      unitLabel={unitLabel}
    />
  );
}
