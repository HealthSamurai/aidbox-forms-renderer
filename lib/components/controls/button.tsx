import "./button.css";
import { ButtonHTMLAttributes, memo } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "md" | "sm";

export type ButtonProps = {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = memo(function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const classes = ["af-button", `af-button--${variant}`];
  if (size !== "md") {
    classes.push(`af-button--${size}`);
  }
  if (className) {
    classes.push(className);
  }

  return (
    <button type={type} className={classes.join(" ")} {...rest}>
      {children}
    </button>
  );
});
