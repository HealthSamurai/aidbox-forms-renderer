import type { GroupAddButtonProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

export function GroupAddButton({ onClick, disabled }: GroupAddButtonProps) {
  return (
    <Button
      type="button"
      variant="success"
      onClick={onClick}
      disabled={disabled}
    >
      Add section
    </Button>
  );
}
