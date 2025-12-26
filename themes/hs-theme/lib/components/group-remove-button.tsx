import type { GroupRemoveButtonProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

export function GroupRemoveButton({
  onClick,
  disabled,
}: GroupRemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="danger"
      onClick={onClick}
      disabled={disabled}
    >
      Remove section
    </Button>
  );
}
