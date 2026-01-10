import type { ComponentType } from "react";

export type NumberInputProperties = {
  id: string;
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
