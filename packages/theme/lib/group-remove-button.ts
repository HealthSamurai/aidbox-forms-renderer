import type { ComponentType } from "react";

export type GroupRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export type GroupRemoveButtonComponent = ComponentType<GroupRemoveButtonProps>;
