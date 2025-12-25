import type { ComponentType, ReactNode } from "react";

export type InputGroupLayout = "grid" | "row";

export type InputGroupProps = {
  children: ReactNode;
  layout: InputGroupLayout;
  weights?: ReadonlyArray<number> | undefined;
};

export type InputGroupComponent = ComponentType<InputGroupProps>;
