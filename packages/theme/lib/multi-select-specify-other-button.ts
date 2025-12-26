import type { ComponentType, ReactNode } from "react";

export type MultiSelectSpecifyOtherButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type MultiSelectSpecifyOtherButtonComponent =
  ComponentType<MultiSelectSpecifyOtherButtonProps>;
