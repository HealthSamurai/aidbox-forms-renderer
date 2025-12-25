import type { ComponentType, ReactNode } from "react";

export type DisplayRendererProps = {
  linkId: string;
  children: ReactNode;
};

export type DisplayRendererComponent = ComponentType<DisplayRendererProps>;
