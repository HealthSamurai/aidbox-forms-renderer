import type { ComponentType, ReactNode } from "react";

export type NodeLegalProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeLegalComponent = ComponentType<NodeLegalProperties>;
