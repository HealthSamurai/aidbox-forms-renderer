import type { ComponentType, ReactNode } from "react";

export type GroupWrapperScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
  toolbar?: ReactNode;
};

export type GroupWrapperScaffoldComponent =
  ComponentType<GroupWrapperScaffoldProps>;
