import type { ComponentType, ReactNode } from "react";

export type CustomOptionAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean | undefined;
};

export type CustomOptionFormProperties = {
  content: ReactNode;
  errors?: ReactNode;
  submit: CustomOptionAction;
  cancel: CustomOptionAction;
};

export type CustomOptionFormComponent =
  ComponentType<CustomOptionFormProperties>;
