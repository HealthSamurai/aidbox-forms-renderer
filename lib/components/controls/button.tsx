import "./button.css";
import { ButtonHTMLAttributes, memo } from "react";
import cx from "classnames";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";

export type ButtonProps = {
  variant?: ButtonVariant | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = memo(function Button({
  variant = "primary",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("af-button", `af-button--${variant}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
});
