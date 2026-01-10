import type { ComponentType, ReactNode } from "react";

export type InputGroupLayout = "grid" | "row";

export type InputGroupProperties = {
  children: ReactNode;
  layout: InputGroupLayout;
  weights?: number[] | undefined;
};

export type InputGroupComponent = ComponentType<InputGroupProperties>;
