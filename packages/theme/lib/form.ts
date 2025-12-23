import type { ComponentType, FormEventHandler, ReactNode } from "react";

export type FormProps = {
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
  children: ReactNode;
};

export type FormComponent = ComponentType<FormProps>;
