import type { ComponentType, ReactNode } from "react";

export type DisplayRendererProperties = {
  linkId: string;
  children: ReactNode;
};

export type DisplayRendererComponent = ComponentType<DisplayRendererProperties>;
