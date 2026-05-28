import type { HTMLAttributes } from "react";
import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type TextInputProperties = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  path?: NodePath | undefined;
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
  path,
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
      path={path}
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
