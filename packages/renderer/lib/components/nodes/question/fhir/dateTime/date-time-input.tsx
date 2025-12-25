import { useTheme } from "../../../../../ui/theme.tsx";

export type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function DateTimeInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: DateTimeInputProps) {
  const { DateTimeInput: ThemedDateTimeInput } = useTheme();
  return (
    <ThemedDateTimeInput
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
