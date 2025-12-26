import type { FormEvent } from "react";
import type { FormProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function Form({ onSubmit, children }: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return <FormElement onSubmit={handleSubmit}>{children}</FormElement>;
}

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
