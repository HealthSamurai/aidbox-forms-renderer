import type { ComponentType, ReactNode } from "react";

export type EmptyStateProperties = {
  children: ReactNode;
};

export type EmptyStateComponent = ComponentType<EmptyStateProperties>;
