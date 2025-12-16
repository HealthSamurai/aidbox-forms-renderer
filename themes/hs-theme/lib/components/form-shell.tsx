import type { FormShellProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function FormShell({ onSubmit, children }: FormShellProps) {
  return <FormElement onSubmit={onSubmit}>{children}</FormElement>;
}

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
