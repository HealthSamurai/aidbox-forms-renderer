import type { ComponentType, ReactNode } from "react";

export type RadioButtonProps = {
  id?: string | undefined;
  groupName: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
  hideLabel?: boolean;
};

export type RadioButtonComponent = ComponentType<RadioButtonProps>;
