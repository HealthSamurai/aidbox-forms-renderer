import type { ComponentType } from "react";

export type LinkProps = {
  href: string;
  label: string;
  target?: string | undefined;
  rel?: string | undefined;
};

export type LinkComponent = ComponentType<LinkProps>;
