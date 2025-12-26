import type { ComponentType, ReactNode } from "react";

export type MultiSelectClearAllButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type MultiSelectClearAllButtonComponent =
  ComponentType<MultiSelectClearAllButtonProps>;
