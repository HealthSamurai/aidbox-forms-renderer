import type { ComponentType, ReactNode } from "react";

export type GroupAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type GroupAddButtonComponent = ComponentType<GroupAddButtonProps>;
