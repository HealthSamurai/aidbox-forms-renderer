import { styled } from "@linaria/react";
import type { FormSubmitButtonProps } from "@aidbox-forms/theme";

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

  background: #2563eb;
  color: #fff;
  border-color: #1d4ed8;
`;

export function FormSubmitButton({
  disabled,
  onClick,
  children,
}: FormSubmitButtonProps) {
  const label = children ?? "Submit";
  return (
    <ButtonRoot type="submit" disabled={disabled} onClick={onClick}>
      {label}
    </ButtonRoot>
  );
}
