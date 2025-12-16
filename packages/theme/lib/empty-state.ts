import type { ComponentType, ReactNode } from "react";

export type EmptyStateProps = {
  children: ReactNode;
};

export type EmptyStateComponent = ComponentType<EmptyStateProps>;
