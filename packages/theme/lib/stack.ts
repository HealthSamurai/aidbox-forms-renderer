import type { ComponentType, ReactNode } from "react";

export type StackProperties = {
  children: ReactNode;
};

export type StackComponent = ComponentType<StackProperties>;
