import type { ComponentType, ReactNode } from "react";

export type NodeFlyoverProps = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeFlyoverComponent = ComponentType<NodeFlyoverProps>;
