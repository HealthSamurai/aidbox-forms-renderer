import type { ComponentType, ReactNode } from "react";

export type NodeHeaderProps = {
  label: ReactNode;
  labelId?: string | undefined;
  htmlFor?: string | undefined;
  required?: boolean | undefined;
  help?: ReactNode;
  legal?: ReactNode;
  flyover?: ReactNode;
};

export type NodeHeaderComponent = ComponentType<NodeHeaderProps>;
