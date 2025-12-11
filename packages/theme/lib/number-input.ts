import type { ComponentLike } from "./component-like.ts";

export type NumberInputProps = {
  id?: string | undefined;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  unitLabel?: string | undefined;
  list?: string | undefined;
};

export type NumberInputComponent = ComponentLike<NumberInputProps>;
