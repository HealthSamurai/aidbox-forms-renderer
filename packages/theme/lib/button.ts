import type { ButtonHTMLAttributes, ComponentType, ReactNode } from "react";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "danger" | "success";
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonComponent = ComponentType<ButtonProps>;
