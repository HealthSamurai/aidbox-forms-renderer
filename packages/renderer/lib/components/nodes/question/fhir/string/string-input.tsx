import type { HTMLAttributes } from "react";
import { useTheme } from "../../../../../ui/theme.tsx";

export type StringInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
};

export function StringInput({
  value,
  onChange,
  inputId,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  inputMode,
}: StringInputProps) {
  const { TextInput: ThemedTextInput } = useTheme();
  return (
    <ThemedTextInput
      id={inputId}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      inputMode={inputMode}
    />
  );
}
