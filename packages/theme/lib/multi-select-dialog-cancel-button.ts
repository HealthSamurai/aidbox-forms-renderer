import type { ComponentType, ReactNode } from "react";

export type MultiSelectDialogCancelButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type MultiSelectDialogCancelButtonComponent =
  ComponentType<MultiSelectDialogCancelButtonProps>;
