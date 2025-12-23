import type { ComponentType, ReactNode } from "react";

export type GroupWrapperScaffoldItemProps = {
  children: ReactNode;
  errors?: ReactNode;
  toolbar?: ReactNode;
};

export type GroupWrapperScaffoldItemComponent =
  ComponentType<GroupWrapperScaffoldItemProps>;
