import type { ComponentType, ReactNode } from "react";

export type GroupWrapperScaffoldItemProps = {
  children: ReactNode;
  errors?: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  removeLabel?: string | undefined;
};

export type GroupWrapperScaffoldItemComponent =
  ComponentType<GroupWrapperScaffoldItemProps>;
