import type { ComponentType } from "react";

export type GroupAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type GroupAddButtonComponent = ComponentType<GroupAddButtonProps>;
