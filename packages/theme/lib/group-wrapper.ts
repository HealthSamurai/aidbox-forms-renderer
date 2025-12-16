import type { ComponentType, ReactNode } from "react";

export type GroupWrapperProps = {
  linkId: string;
  legend?: ReactNode;
  items: ReactNode;
  toolbar?: ReactNode;
};

export type GroupWrapperComponent = ComponentType<GroupWrapperProps>;
