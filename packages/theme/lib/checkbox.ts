import type { ComponentType, ReactNode } from "react";

export type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
};

export type CheckboxComponent = ComponentType<CheckboxProps>;
