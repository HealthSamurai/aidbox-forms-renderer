import type { ComponentType, ReactNode } from "react";

export type GroupWrapperScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  items: ReactNode;
  toolbar?: ReactNode;
};

export type GroupWrapperScaffoldComponent =
  ComponentType<GroupWrapperScaffoldProps>;
