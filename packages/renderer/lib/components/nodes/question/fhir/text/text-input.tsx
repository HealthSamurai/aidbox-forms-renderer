import { useTheme } from "../../../../../ui/theme.tsx";

export type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function TextInput({
  value,
  onChange,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: TextInputProps) {
  const { TextArea: ThemedTextArea } = useTheme();
  return (
    <ThemedTextArea
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
