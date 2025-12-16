import type { ComponentType, ReactNode } from "react";

export type DisplayNodeProps = {
  linkId: string;
  content: ReactNode;
};

export type DisplayNodeComponent = ComponentType<DisplayNodeProps>;
