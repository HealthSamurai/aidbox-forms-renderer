import type { ComponentType, ReactNode } from "react";

export type FooterProperties = {
  linkId: string;
  children: ReactNode;
};

export type FooterComponent = ComponentType<FooterProperties>;
