import type { ComponentType, ReactNode } from "react";

export type NodesContainerProps = {
  children: ReactNode;
};

export type NodesContainerComponent = ComponentType<NodesContainerProps>;
