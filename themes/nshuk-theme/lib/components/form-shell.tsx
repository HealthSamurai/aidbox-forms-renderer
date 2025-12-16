import type { FormShellProps } from "@aidbox-forms/theme";

export function FormShell({ onSubmit, children }: FormShellProps) {
  return <form onSubmit={onSubmit}>{children}</form>;
}
