import type { MultiSelectClearAllButtonProps } from "@aidbox-forms/theme";

export function MultiSelectClearAllButton({
  onClick,
  disabled,
  children,
}: MultiSelectClearAllButtonProps) {
  const label = children ?? "Clear all";
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
