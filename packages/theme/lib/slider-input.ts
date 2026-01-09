import type { ComponentType } from "react";

export type SliderInputProps = {
  value: number | null;
  onChange: (v: number | null) => void;
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

export type SliderInputComponent = ComponentType<SliderInputProps>;
