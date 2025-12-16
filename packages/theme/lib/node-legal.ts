import type { ComponentType, ReactNode } from "react";

export type NodeLegalProps = {
  id: string;
  content: ReactNode;
  ariaLabel?: string | undefined;
};

export type NodeLegalComponent = ComponentType<NodeLegalProps>;
