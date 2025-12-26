import type { GroupAddButtonProps } from "@aidbox-forms/theme";

export function GroupAddButton({
  onClick,
  disabled,
  children,
}: GroupAddButtonProps) {
  const label = children ?? "Add section";
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
