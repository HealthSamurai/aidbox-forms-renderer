import type { AnswerRemoveButtonProps } from "@aidbox-forms/theme";

export function AnswerRemoveButton({
  onClick,
  disabled,
  children,
}: AnswerRemoveButtonProps) {
  const label = children ?? "Remove";
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
