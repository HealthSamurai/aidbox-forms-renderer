import { useTheme } from "../../../../../ui/theme.tsx";

export type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function DateTimeInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: DateTimeInputProps) {
  const { DateTimeInput: ThemedDateTimeInput } = useTheme();
  return (
    <ThemedDateTimeInput
      id={inputId}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
