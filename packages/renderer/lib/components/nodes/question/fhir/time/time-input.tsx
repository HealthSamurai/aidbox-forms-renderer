import { useTheme } from "../../../../../ui/theme.tsx";

export type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function TimeInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: TimeInputProps) {
  const { TimeInput: ThemedTimeInput } = useTheme();
  return (
    <ThemedTimeInput
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
