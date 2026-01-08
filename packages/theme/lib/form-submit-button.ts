import type { ComponentType } from "react";

export type FormSubmitButtonProps = {
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  text: string;
};

export type FormSubmitButtonComponent = ComponentType<FormSubmitButtonProps>;
