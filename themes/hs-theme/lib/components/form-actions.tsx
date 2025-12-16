import { styled } from "@linaria/react";
import type { FormActionsProps } from "@aidbox-forms/theme";

export function FormActions({ children }: FormActionsProps) {
  return <Actions>{children}</Actions>;
}

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;
