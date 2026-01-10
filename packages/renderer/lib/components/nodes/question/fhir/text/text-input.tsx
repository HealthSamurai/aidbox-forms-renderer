import type { HTMLAttributes } from "react";
import { useTheme } from "../../../../../ui/theme.tsx";

export type TextInputProperties = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
};

export function TextInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  inputMode,
  minLength,
  maxLength,
}: TextInputProperties) {
  const { TextArea: ThemedTextArea } = useTheme();
  return (
    <ThemedTextArea
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      inputMode={inputMode}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
