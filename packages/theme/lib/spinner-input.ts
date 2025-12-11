import type { ComponentLike } from "./component-like.ts";

export type SpinnerInputProps = {
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  placeholder?: string | undefined;
};

export type SpinnerInputComponent = ComponentLike<SpinnerInputProps>;
