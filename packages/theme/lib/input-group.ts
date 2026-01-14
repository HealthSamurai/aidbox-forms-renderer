import type { ComponentType, ReactNode } from "react";

export type InputGroupProperties = {
  children: ReactNode;
  spans: number[];
};

export type InputGroupComponent = ComponentType<InputGroupProperties>;
