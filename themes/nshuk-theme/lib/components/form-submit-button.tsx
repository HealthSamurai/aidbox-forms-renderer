import type { FormSubmitButtonProps } from "@aidbox-forms/theme";

export function FormSubmitButton({
  disabled,
  onClick,
  children,
}: FormSubmitButtonProps) {
  const label = children ?? "Submit";
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className="nhsuk-button"
    >
      {label}
    </button>
  );
}
