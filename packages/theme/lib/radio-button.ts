import type { ComponentType, ReactNode } from "react";

export type RadioButtonProps = {
  id: string;
  groupName: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
};

export type RadioButtonComponent = ComponentType<RadioButtonProps>;
