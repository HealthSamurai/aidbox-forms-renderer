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
  min?: number | undefined;
  max?: number | undefined;
  step?: number | "any";
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
  min,
  max,
  step,
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
      step={step ?? "any"}
      unitLabel={unitLabel}
      min={min}
      max={max}
    />
  );
}
