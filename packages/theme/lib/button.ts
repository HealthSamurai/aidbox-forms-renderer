import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ComponentLike } from "./component-like.ts";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "danger" | "success";
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonComponent = ComponentLike<ButtonProps>;
