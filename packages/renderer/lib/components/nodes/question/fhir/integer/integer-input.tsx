import { useTheme } from "../../../../../ui/theme.tsx";

export type IntegerInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
};

export function IntegerInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  unitLabel,
  min,
  max,
}: IntegerInputProps) {
  const { NumberInput: ThemedNumberInput } = useTheme();
  return (
    <ThemedNumberInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value ?? null}
      onChange={(next) => onChange(next != null ? Math.round(next) : null)}
      disabled={disabled}
      step={1}
      unitLabel={unitLabel}
      min={min}
      max={max}
    />
  );
}
