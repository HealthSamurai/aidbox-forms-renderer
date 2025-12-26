import type { ComponentType, ReactNode } from "react";

export type FormResetButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type FormResetButtonComponent = ComponentType<FormResetButtonProps>;
