import type { ComponentType, ReactNode } from "react";

export type FormSubmitButtonProps = {
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  children?: ReactNode;
};

export type FormSubmitButtonComponent = ComponentType<FormSubmitButtonProps>;
