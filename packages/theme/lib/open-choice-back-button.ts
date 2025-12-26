import type { ComponentType, ReactNode } from "react";

export type OpenChoiceBackButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type OpenChoiceBackButtonComponent =
  ComponentType<OpenChoiceBackButtonProps>;
