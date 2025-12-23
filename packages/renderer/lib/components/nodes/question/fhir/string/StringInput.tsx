import type { HTMLAttributes } from "react";
import { useTheme } from "../../../../../ui/theme.tsx";

export type StringInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  list?: string | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
};

export function StringInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
  list,
  inputMode,
}: StringInputProps) {
  const { TextInput: ThemedTextInput } = useTheme();
  return (
    <ThemedTextInput
      id={inputId}
      list={list}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      inputMode={inputMode}
    />
  );
}
