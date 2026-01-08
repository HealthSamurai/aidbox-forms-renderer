import type { ComponentType } from "react";

export type GroupRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type GroupRemoveButtonComponent = ComponentType<GroupRemoveButtonProps>;
