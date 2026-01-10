import type { ComponentType, ReactNode } from "react";

export type NodeHelpProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeHelpComponent = ComponentType<NodeHelpProperties>;
