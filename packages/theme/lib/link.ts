import type { ComponentType, ReactNode } from "react";

export type LinkProps = {
  href: string;
  children: ReactNode;
  target?: string | undefined;
  rel?: string | undefined;
};

export type LinkComponent = ComponentType<LinkProps>;
