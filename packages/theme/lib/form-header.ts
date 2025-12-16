import type { ComponentType, ReactNode } from "react";

export type FormHeaderProps = {
  title?: ReactNode;
  description?: ReactNode;
};

export type FormHeaderComponent = ComponentType<FormHeaderProps>;
