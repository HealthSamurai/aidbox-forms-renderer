import type { ComponentType } from "react";

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
  unitLabel?: string | undefined;
};

export type SpinnerInputComponent = ComponentType<SpinnerInputProps>;
