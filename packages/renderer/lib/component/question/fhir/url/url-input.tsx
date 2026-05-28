import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type UrlInputProperties = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
};

export function UrlInput({
  value,
  onChange,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  minLength,
  maxLength,
}: UrlInputProperties) {
  const { TextInput: ThemedTextInput } = useTheme();
  return (
    <ThemedTextInput
      id={id}
      path={path}
      type="url"
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
