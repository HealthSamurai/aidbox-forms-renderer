import type { ComponentType } from "react";
import type { NodePath } from "./path.ts";

export type SpinnerInputProperties = {
  id: string;
  path?: NodePath | undefined;
  value: number | undefined;
  onChange: (v?: number) => void;
  disabled?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
  unitLabel?: string | undefined;
};

export type SpinnerInputComponent = ComponentType<SpinnerInputProperties>;
