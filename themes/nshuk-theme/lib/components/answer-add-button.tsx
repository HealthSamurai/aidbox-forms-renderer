import type { AnswerAddButtonProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

export function AnswerAddButton({ onClick, disabled }: AnswerAddButtonProps) {
  return (
    <Button
      type="button"
      variant="success"
      onClick={onClick}
      disabled={disabled}
    >
      Add another
    </Button>
  );
}
