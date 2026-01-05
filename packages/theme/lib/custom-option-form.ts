import type { ComponentType, ReactNode } from "react";

export type CustomOptionAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean | undefined;
};

export type CustomOptionFormProps = {
  content: ReactNode;
  errors?: ReactNode;
  submit: CustomOptionAction;
  cancel: CustomOptionAction;
};

export type CustomOptionFormComponent = ComponentType<CustomOptionFormProps>;
