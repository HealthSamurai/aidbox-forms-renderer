import type { ComponentType, ReactNode } from "react";

export type HeaderProperties = {
  linkId: string;
  children: ReactNode;
};

export type HeaderComponent = ComponentType<HeaderProperties>;
