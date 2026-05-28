import type { ComponentType } from "react";
import type { NodePath } from "./path.ts";

export type NumberInputProperties = {
  id: string;
  path?: NodePath | undefined;
  value: number | undefined;
  onChange: (v?: number) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  min?: number | undefined;
  max?: number | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  unitLabel?: string | undefined;
};

export type NumberInputComponent = ComponentType<NumberInputProperties>;
