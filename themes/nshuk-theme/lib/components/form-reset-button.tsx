import type { FormResetButtonProps } from "@aidbox-forms/theme";

export function FormResetButton({
  onClick,
  disabled,
  children,
}: FormResetButtonProps) {
  const label = children ?? "Reset";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--secondary"
    >
      {label}
    </button>
  );
}
