import type { ComponentType } from "react";

export type NumberInputProps = {
  id: string;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  min?: number | undefined;
  max?: number | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  unitLabel?: string | undefined;
};

export type NumberInputComponent = ComponentType<NumberInputProps>;
