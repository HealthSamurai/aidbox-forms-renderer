import { styled } from "@linaria/react";
import type { AnswerAddButtonProps } from "@aidbox-forms/theme";

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

  background: #38a169;
  color: #fff;
  border-color: #2f855a;
`;

export function AnswerAddButton({
  onClick,
  disabled,
  children,
}: AnswerAddButtonProps) {
  const label = children ?? "Add another";
  return (
    <ButtonRoot type="button" onClick={onClick} disabled={disabled}>
      {label}
    </ButtonRoot>
  );
}
