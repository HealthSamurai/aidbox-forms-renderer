import type { AnswerAddButtonProps } from "@aidbox-forms/theme";

export function AnswerAddButton({
  onClick,
  disabled,
  text,
}: AnswerAddButtonProps) {
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
