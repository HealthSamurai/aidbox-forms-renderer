import type { ComponentType } from "react";

export type GroupAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export type GroupAddButtonComponent = ComponentType<GroupAddButtonProps>;
