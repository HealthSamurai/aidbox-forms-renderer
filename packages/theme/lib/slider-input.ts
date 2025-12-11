import type { ComponentLike } from "./component-like.ts";

export type SliderInputProps = {
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  lowerLabel?: string | undefined;
  upperLabel?: string | undefined;
};

export type SliderInputComponent = ComponentLike<SliderInputProps>;
