import type { ButtonProps } from "@aidbox-forms/theme";

const variantClassMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "",
  secondary: "nhsuk-button--secondary",
  success: "nhsuk-button--secondary",
  danger: "nhsuk-button--warning",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  const resolvedVariant = variant ?? "primary";
  const classes = [
    "nhsuk-button",
    variantClassMap[resolvedVariant],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
