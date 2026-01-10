import type { ReactNode } from "react";
import { useTheme } from "../../../../../ui/theme.tsx";

export type BooleanInputProperties = {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  label?: ReactNode | undefined;
};

export function BooleanInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  label,
}: BooleanInputProperties) {
  const { Checkbox } = useTheme();
  const checked = value === true;

  return (
    <Checkbox
      checked={checked}
      onChange={() => onChange(!checked)}
      id={id}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={Boolean(disabled)}
      label={label}
    />
  );
}
