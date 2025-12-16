import type { ComponentType, ReactNode } from "react";

export type NodeWrapperProps = {
  linkId: string;
  children: ReactNode;
  className?: string | undefined;
};

export type NodeWrapperComponent = ComponentType<NodeWrapperProps>;
