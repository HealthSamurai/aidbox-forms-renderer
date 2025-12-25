import type { ComponentType, ReactNode } from "react";

export type NodeHelpProps = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeHelpComponent = ComponentType<NodeHelpProps>;
