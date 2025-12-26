import { styled } from "@linaria/react";
import type { MultiSelectSpecifyOtherButtonProps } from "@aidbox-forms/theme";

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

  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;

export function MultiSelectSpecifyOtherButton({
  onClick,
  disabled,
  children,
}: MultiSelectSpecifyOtherButtonProps) {
  const label = children ?? "Specify other";
  return (
    <ButtonRoot type="button" onClick={onClick} disabled={disabled}>
      {label}
    </ButtonRoot>
  );
}
