import type { ComponentType, ReactNode } from "react";

export type CheckboxProps = {
  id?: string | undefined;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
  hideLabel?: boolean;
};

export type CheckboxComponent = ComponentType<CheckboxProps>;
