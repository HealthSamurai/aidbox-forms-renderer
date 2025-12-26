import type { AnswerRemoveButtonProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

export function AnswerRemoveButton({
  onClick,
  disabled,
}: AnswerRemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="danger"
      onClick={onClick}
      disabled={disabled}
    >
      Remove
    </Button>
  );
}
