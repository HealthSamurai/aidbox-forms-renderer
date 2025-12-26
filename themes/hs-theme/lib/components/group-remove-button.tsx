import { styled } from "@linaria/react";
import type { GroupRemoveButtonProps } from "@aidbox-forms/theme";

const ButtonRoot = styled.button`
  cursor: pointer;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  background: #f56565;
  color: #fff;
  border-color: #e53e3e;
`;

export function GroupRemoveButton({
  onClick,
  disabled,
  children,
}: GroupRemoveButtonProps) {
  const label = children ?? "Remove section";
  return (
    <ButtonRoot type="button" onClick={onClick} disabled={disabled}>
      {label}
    </ButtonRoot>
  );
}
