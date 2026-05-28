import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type DateInputProperties = {
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

export function DateInput({
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
}: DateInputProperties) {
  const { DateInput: ThemedDateInput } = useTheme();
  return (
    <ThemedDateInput
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
