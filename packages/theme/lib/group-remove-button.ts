import type { ComponentType, ReactNode } from "react";

export type GroupRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type GroupRemoveButtonComponent = ComponentType<GroupRemoveButtonProps>;
