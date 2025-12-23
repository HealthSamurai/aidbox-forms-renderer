import type { FormProps } from "@aidbox-forms/theme";

export function Form({ onSubmit, children }: FormProps) {
  return <form onSubmit={onSubmit}>{children}</form>;
}
