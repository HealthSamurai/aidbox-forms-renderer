import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type IntegerInputProperties = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  unitLabel?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
};

export function IntegerInput({
  value,
  onChange,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  disabled,
  unitLabel,
  min,
  max,
}: IntegerInputProperties) {
  const { NumberInput: ThemedNumberInput } = useTheme();
  return (
    <ThemedNumberInput
      id={id}
      path={path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      placeholder={placeholder}
      value={value}
      onChange={(next) =>
        onChange(next == undefined ? undefined : Math.round(next))
      }
      disabled={disabled}
      step={1}
      unitLabel={unitLabel}
      min={min}
      max={max}
    />
  );
}
