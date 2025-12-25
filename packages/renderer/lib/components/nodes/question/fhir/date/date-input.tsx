import { useTheme } from "../../../../../ui/theme.tsx";

export type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function DateInput({
  value,
  onChange,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: DateInputProps) {
  const { DateInput: ThemedDateInput } = useTheme();
  return (
    <ThemedDateInput
      id={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
