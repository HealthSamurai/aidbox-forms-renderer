import type { ComponentType, ReactNode } from "react";

export type NodeLegalProps = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeLegalComponent = ComponentType<NodeLegalProps>;
