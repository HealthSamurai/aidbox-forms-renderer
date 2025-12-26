import type { MultiSelectDialogAddButtonProps } from "@aidbox-forms/theme";

export function MultiSelectDialogAddButton({
  onClick,
  disabled,
  children,
}: MultiSelectDialogAddButtonProps) {
  const label = children ?? "Add";
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
