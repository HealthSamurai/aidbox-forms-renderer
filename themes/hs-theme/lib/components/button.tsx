import { styled } from "@linaria/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success";
  children?: ReactNode;
};

const ButtonRoot = styled.button<{
  $variant: NonNullable<ButtonProps["variant"]>;
}>`
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

  ${({ $variant }) => {
    switch ($variant) {
      case "secondary":
        return `
          background: #edf2f7;
          color: #1a202c;
          border-color: #cbd5e0;
        `;
      case "danger":
        return `
          background: #f56565;
          color: #fff;
          border-color: #e53e3e;
        `;
      case "success":
        return `
          background: #38a169;
          color: #fff;
          border-color: #2f855a;
        `;
      case "primary":
      default:
        return `
          background: #2563eb;
          color: #fff;
          border-color: #1d4ed8;
        `;
    }
  }}
`;

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <ButtonRoot {...rest} className={className} $variant={variant}>
      {children}
    </ButtonRoot>
  );
}
