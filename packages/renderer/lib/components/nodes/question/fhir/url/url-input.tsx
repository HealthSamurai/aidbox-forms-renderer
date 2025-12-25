import { useTheme } from "../../../../../ui/theme.tsx";

export type UrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function UrlInput({
  value,
  onChange,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
}: UrlInputProps) {
  const { TextInput: ThemedTextInput } = useTheme();
  return (
    <ThemedTextInput
      id={inputId}
      type="url"
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
