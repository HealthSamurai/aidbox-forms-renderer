import { styled } from "@linaria/react";
import type { GroupRemoveButtonProps } from "@aidbox-forms/theme";
import { Trash } from "../icons/trash.tsx";

const ButtonRoot = styled.button`
  cursor: pointer;
  border-radius: 0.375rem;
  padding: 0.5rem;
  border: 1px solid transparent;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;

export function GroupRemoveButton({
  onClick,
  disabled,
  text,
}: GroupRemoveButtonProps) {
  return (
    <ButtonRoot
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={text}
      aria-label={text}
    >
      <Trash />
    </ButtonRoot>
  );
}
