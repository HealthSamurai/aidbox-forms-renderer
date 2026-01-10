import type { ComponentType } from "react";

export type SpinnerInputProperties = {
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
