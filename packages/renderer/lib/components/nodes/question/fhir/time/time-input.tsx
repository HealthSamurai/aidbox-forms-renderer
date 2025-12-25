import { useTheme } from "../../../../../ui/theme.tsx";

export type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function TimeInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: TimeInputProps) {
  const { TimeInput: ThemedTimeInput } = useTheme();
  return (
    <ThemedTimeInput
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
