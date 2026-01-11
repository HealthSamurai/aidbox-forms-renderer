import type { ComponentType, ReactNode } from "react";

export type FlyoverProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type FlyoverComponent = ComponentType<FlyoverProperties>;
