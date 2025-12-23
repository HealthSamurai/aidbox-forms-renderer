import type { ComponentType, ReactNode } from "react";

export type SelectOrInputFieldProps = {
  input?: ReactNode;
  inputFooter?: ReactNode;
};

export type SelectOrInputFieldComponent =
  ComponentType<SelectOrInputFieldProps>;
