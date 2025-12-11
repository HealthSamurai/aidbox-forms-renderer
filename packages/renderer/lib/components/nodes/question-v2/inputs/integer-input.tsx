import { useTheme } from "../../../../ui/theme.tsx";

export type IntegerInputProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
  list?: string | undefined;
};

export function IntegerInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
  unitLabel,
  list,
}: IntegerInputProps) {
  const { NumberInput } = useTheme();
  return (
    <NumberInput
      id={inputId}
      list={list}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      placeholder={placeholder}
      value={value ?? null}
      onChange={(next) => onChange(next != null ? Math.round(next) : null)}
      disabled={disabled}
      step={1}
      unitLabel={unitLabel}
    />
  );
}
