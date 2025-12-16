import type { ComponentType, ReactNode } from "react";

export type OpenChoiceFieldProps = {
  select: ReactNode;
  input: ReactNode;
};

export type OpenChoiceFieldComponent = ComponentType<OpenChoiceFieldProps>;
