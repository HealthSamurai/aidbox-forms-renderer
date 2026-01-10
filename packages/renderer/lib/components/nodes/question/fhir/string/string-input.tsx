import type { HTMLAttributes } from "react";
import { useTheme } from "../../../../../ui/theme.tsx";

export type StringInputProperties = {
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

export function StringInput({
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
}: StringInputProperties) {
  const { TextInput: ThemedTextInput } = useTheme();
  return (
    <ThemedTextInput
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
