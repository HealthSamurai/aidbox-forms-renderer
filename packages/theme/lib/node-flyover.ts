import type { ComponentType, ReactNode } from "react";

export type NodeFlyoverProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeFlyoverComponent = ComponentType<NodeFlyoverProperties>;
