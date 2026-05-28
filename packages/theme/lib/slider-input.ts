import type { ComponentType } from "react";
import type { NodePath } from "./path.ts";

export type SliderInputProperties = {
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
  lowerLabel?: string | undefined;
  upperLabel?: string | undefined;
  unitLabel?: string | undefined;
};

export type SliderInputComponent = ComponentType<SliderInputProperties>;
