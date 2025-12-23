import type { ComponentType, ReactNode } from "react";

export type SelectOrInputFieldProps = {
  select?: ReactNode;
  input?: ReactNode;
  inputFooter?: ReactNode;
};

export type SelectOrInputFieldComponent =
  ComponentType<SelectOrInputFieldProps>;
