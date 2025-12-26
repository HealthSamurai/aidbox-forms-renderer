import type { ComponentType, ReactNode } from "react";

export type FormProps = {
  onSubmit?: (() => void) | undefined;
  children: ReactNode;
};

export type FormComponent = ComponentType<FormProps>;
