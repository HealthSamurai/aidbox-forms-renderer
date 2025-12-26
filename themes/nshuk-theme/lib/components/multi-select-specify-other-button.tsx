import type { MultiSelectSpecifyOtherButtonProps } from "@aidbox-forms/theme";

export function MultiSelectSpecifyOtherButton({
  onClick,
  disabled,
  children,
}: MultiSelectSpecifyOtherButtonProps) {
  const label = children ?? "Specify other";
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
