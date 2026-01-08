import type { AnswerRemoveButtonProps } from "@aidbox-forms/theme";

export function AnswerRemoveButton({
  onClick,
  disabled,
  text,
}: AnswerRemoveButtonProps) {
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
