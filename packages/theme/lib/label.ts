import type { ComponentType, ReactNode } from "react";

export type LabelAs = "legend" | "label" | "text";

export type LabelProperties = {
  prefix?: ReactNode;
  children: ReactNode;
  id: string;
  htmlFor?: string | undefined;
  required?: boolean | undefined;
  help?: ReactNode;
  legal?: ReactNode;
  flyover?: ReactNode;
  as?: LabelAs | undefined;
};

export type LabelComponent = ComponentType<LabelProperties>;
