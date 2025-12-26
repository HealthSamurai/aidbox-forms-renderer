import type { OpenChoiceBackButtonProps } from "@aidbox-forms/theme";

export function OpenChoiceBackButton({
  onClick,
  disabled,
  children,
}: OpenChoiceBackButtonProps) {
  const label = children ?? "Back to options";
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
