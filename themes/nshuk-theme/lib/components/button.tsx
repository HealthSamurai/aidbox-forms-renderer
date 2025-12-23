import type { ButtonProps } from "@aidbox-forms/theme";

const variantClassMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "",
  secondary: "nhsuk-button--secondary",
  success: "nhsuk-button--secondary",
  danger: "nhsuk-button--warning",
};

export function Button({
  variant = "primary",
  type,
  onClick,
  disabled,
  children,
}: ButtonProps) {
  const resolvedVariant = variant ?? "primary";
  const classes = ["nhsuk-button", variantClassMap[resolvedVariant]]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
