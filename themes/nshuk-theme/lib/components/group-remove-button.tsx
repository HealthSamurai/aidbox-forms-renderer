import type { GroupRemoveButtonProps } from "@aidbox-forms/theme";

export function GroupRemoveButton({
  onClick,
  disabled,
  children,
}: GroupRemoveButtonProps) {
  const label = children ?? "Remove section";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--warning"
    >
      {label}
    </button>
  );
}
