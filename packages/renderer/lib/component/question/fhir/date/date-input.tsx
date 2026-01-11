import { useTheme } from "../../../../ui/theme.tsx";

export type DateInputProperties = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  min?: string | undefined;
  max?: string | undefined;
};

export function DateInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  min,
  max,
}: DateInputProperties) {
  const { DateInput: ThemedDateInput } = useTheme();
  return (
    <ThemedDateInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
}
