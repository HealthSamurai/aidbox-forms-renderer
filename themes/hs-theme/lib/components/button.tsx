import "./button.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success";
  children?: ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={classNames("af-btn", `af-btn--${variant}`, className)}
    >
      {children}
    </button>
  );
}
