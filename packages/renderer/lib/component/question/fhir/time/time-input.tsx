import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type TimeInputProperties = {
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

export function TimeInput({
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
}: TimeInputProperties) {
  const { TimeInput: ThemedTimeInput } = useTheme();
  return (
    <ThemedTimeInput
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
