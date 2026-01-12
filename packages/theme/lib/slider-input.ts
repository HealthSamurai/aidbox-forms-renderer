import type { ComponentType } from "react";

export type SliderInputProperties = {
  id: string;
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
