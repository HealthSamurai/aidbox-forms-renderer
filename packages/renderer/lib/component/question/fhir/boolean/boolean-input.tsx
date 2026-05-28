import type { ReactNode } from "react";
import type { NodePath } from "@formbox/theme";
import { useTheme } from "../../../../ui/theme.tsx";

export type BooleanInputProperties = {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  label?: ReactNode | undefined;
};

export function BooleanInput({
  value,
  onChange,
  id,
  path,
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
      path={path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={Boolean(disabled)}
      checkedValue="true"
      uncheckedValue={value === undefined ? undefined : "false"}
      label={label}
    />
  );
}
