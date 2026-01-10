import type { ComponentType, ReactNode } from "react";

export type NodeListProperties = {
  children: ReactNode;
};

export type NodeListComponent = ComponentType<NodeListProperties>;
