import type { ComponentType, ReactNode } from "react";

export type GroupContainerProps = {
  linkId: string;
  legend?: ReactNode;
  children: ReactNode;
  dataControl?: string | null | undefined;
};

export type GroupContainerComponent = ComponentType<GroupContainerProps>;
