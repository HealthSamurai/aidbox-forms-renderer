import type { ComponentType, ReactNode } from "react";

export type NodeHeaderAs = "legend" | "label" | "text";

export type NodeHeaderProps = {
  label: ReactNode;
  ariaLabelledBy?: string | undefined;
  htmlFor?: string | undefined;
  required?: boolean | undefined;
  help?: ReactNode;
  legal?: ReactNode;
  flyover?: ReactNode;
  as?: NodeHeaderAs | undefined;
};

export type NodeHeaderComponent = ComponentType<NodeHeaderProps>;
