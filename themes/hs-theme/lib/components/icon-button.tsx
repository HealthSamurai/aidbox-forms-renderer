import type { ReactNode } from "react";
import { styled } from "@linaria/react";

export type IconButtonProperties = {
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean | undefined;
  label: string;
};

export function IconButton({
  icon,
  onClick,
  disabled,
  label,
}: IconButtonProperties) {
  return (
    <ButtonRoot
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {icon}
    </ButtonRoot>
  );
}

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
