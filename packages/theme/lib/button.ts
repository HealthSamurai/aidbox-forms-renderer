import type { ComponentType, ReactNode } from "react";

export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
};

export type ButtonComponent = ComponentType<ButtonProps>;
