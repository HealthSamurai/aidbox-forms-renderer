import type { ComponentType, ReactNode } from "react";

export type HelpProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type HelpComponent = ComponentType<HelpProperties>;
