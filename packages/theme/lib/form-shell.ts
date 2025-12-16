import type { ComponentType, FormEventHandler, ReactNode } from "react";

export type FormShellProps = {
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
  children: ReactNode;
};

export type FormShellComponent = ComponentType<FormShellProps>;
