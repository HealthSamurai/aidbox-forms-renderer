import type { MultiSelectDialogCancelButtonProps } from "@aidbox-forms/theme";

export function MultiSelectDialogCancelButton({
  onClick,
  disabled,
  children,
}: MultiSelectDialogCancelButtonProps) {
  const label = children ?? "Cancel";
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
