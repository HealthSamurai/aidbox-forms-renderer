import type { ComponentType, ReactNode } from "react";

export type FormSectionProps = {
  children: ReactNode;
  variant?: "header" | "footer" | "default";
};

export type FormSectionComponent = ComponentType<FormSectionProps>;
