import type { FormProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function Form({ onSubmit, children }: FormProps) {
  return <FormElement onSubmit={onSubmit}>{children}</FormElement>;
}

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
