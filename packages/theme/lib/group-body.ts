import type { ComponentType, ReactNode } from "react";

export type GroupBodyProps = {
  linkId: string;
  legend?: ReactNode;
  children: ReactNode;
  dataControl?: string | null | undefined;
};

export type GroupBodyComponent = ComponentType<GroupBodyProps>;
