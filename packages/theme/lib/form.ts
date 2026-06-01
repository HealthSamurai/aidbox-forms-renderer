import type { ComponentType, ReactNode } from "react";
import type { CustomExtensionValues } from "./custom-extension.tsx";

export type FormProperties = {
  id?: string | undefined;
  onSubmit?: (() => void) | undefined;
  onCancel?: (() => void) | undefined;
  children: ReactNode;
  pagination?: FormPagination | undefined;
  title?: string | undefined;
  description?: string | undefined;
  languageSelector?: ReactNode;
  errors?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
  signature?: ReactNode;
  customExtensions?: CustomExtensionValues | undefined;
};

export type FormComponent = ComponentType<FormProperties>;

export type FormPagination = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
};
