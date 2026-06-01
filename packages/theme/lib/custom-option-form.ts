import type { ComponentType, ReactNode } from "react";

export type CustomOptionFormProperties = {
  id?: string | undefined;
  content: ReactNode;
  errors?: ReactNode | undefined;
  onCancel: () => void;
  onSubmit: () => void;
  canSubmit?: boolean | undefined;
};

export type CustomOptionFormComponent =
  ComponentType<CustomOptionFormProperties>;
