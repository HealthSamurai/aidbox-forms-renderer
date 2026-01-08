import type { ComponentType } from "react";

export type FormResetButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type FormResetButtonComponent = ComponentType<FormResetButtonProps>;
