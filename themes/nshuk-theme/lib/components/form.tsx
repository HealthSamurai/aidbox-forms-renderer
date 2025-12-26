import type { FormEvent } from "react";
import type { FormProps } from "@aidbox-forms/theme";

export function Form({ onSubmit, children }: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return <form onSubmit={handleSubmit}>{children}</form>;
}
