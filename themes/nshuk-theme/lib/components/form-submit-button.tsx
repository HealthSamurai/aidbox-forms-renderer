import type { FormSubmitButtonProps } from "@aidbox-forms/theme";

export function FormSubmitButton({
  disabled,
  onClick,
  text,
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className="nhsuk-button"
    >
      {text}
    </button>
  );
}
