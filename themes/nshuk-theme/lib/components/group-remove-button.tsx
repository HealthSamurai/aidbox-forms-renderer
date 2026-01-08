import type { GroupRemoveButtonProps } from "@aidbox-forms/theme";

export function GroupRemoveButton({
  onClick,
  disabled,
  text,
}: GroupRemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--secondary"
      title={text}
      aria-label={text}
    >
      −
    </button>
  );
}
