import type { ComponentType, ReactNode } from "react";

export type LegalProperties = {
  id: string;
  children: ReactNode;
  ariaLabel?: string | undefined;
};

export type LegalComponent = ComponentType<LegalProperties>;
