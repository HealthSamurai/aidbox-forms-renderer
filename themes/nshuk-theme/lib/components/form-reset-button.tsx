import type { FormResetButtonProps } from "@aidbox-forms/theme";

export function FormResetButton({
  onClick,
  disabled,
  text,
}: FormResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--secondary"
    >
      {text}
    </button>
  );
}
