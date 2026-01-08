import type { GroupAddButtonProps } from "@aidbox-forms/theme";

export function GroupAddButton({
  onClick,
  disabled,
  text,
}: GroupAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--secondary"
      title={text}
      aria-label={text}
    >
      ＋
    </button>
  );
}
