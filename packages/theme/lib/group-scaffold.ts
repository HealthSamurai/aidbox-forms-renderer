import type { ComponentType, ReactNode } from "react";

export type GroupScaffoldProperties = {
  header?: ReactNode;
  children?: ReactNode;
  errors?: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  removeLabel?: string | undefined;
};

export type GroupScaffoldComponent = ComponentType<GroupScaffoldProperties>;
