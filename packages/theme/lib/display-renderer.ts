import type { ComponentType, ReactNode } from "react";

export type DisplayRendererProps = {
  linkId: string;
  content: ReactNode;
};

export type DisplayRendererComponent = ComponentType<DisplayRendererProps>;
