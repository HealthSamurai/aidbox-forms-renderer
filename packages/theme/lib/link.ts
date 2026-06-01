import type { ComponentType, ReactNode } from "react";

export type LinkProperties = {
  id?: string | undefined;
  href: string;
  children: ReactNode;
  target?: string | undefined;
  rel?: string | undefined;
};

export type LinkComponent = ComponentType<LinkProperties>;
