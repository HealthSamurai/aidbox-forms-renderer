import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type DateTimeInputProperties = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  min?: string | undefined;
  max?: string | undefined;
};

export function DateTimeInput({
  value,
  onChange,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  min,
  max,
}: DateTimeInputProperties) {
  const { DateTimeInput: ThemedDateTimeInput } = useTheme();
  return (
    <ThemedDateTimeInput
      id={id}
      path={path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
}
