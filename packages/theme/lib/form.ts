import type { ComponentType, ReactNode } from "react";

export type FormProps = {
  onSubmit?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  children: ReactNode;
  pagination?: FormPagination | undefined;
  title?: string | undefined;
  description?: string | undefined;
  errors?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
};

export type FormComponent = ComponentType<FormProps>;

export type FormPagination = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
};
