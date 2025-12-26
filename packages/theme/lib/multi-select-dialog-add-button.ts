import type { ComponentType, ReactNode } from "react";

export type MultiSelectDialogAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type MultiSelectDialogAddButtonComponent =
  ComponentType<MultiSelectDialogAddButtonProps>;
