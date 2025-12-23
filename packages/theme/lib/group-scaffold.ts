import type { ComponentType, ReactNode } from "react";

export type GroupScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
  dataControl?: string | null | undefined;
};

export type GroupScaffoldComponent = ComponentType<GroupScaffoldProps>;
