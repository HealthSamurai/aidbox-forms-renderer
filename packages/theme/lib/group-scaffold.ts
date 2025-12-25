import type { ComponentType, ReactNode } from "react";

export type GroupScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
  dataControl?: string | undefined;
};

export type GroupScaffoldComponent = ComponentType<GroupScaffoldProps>;
