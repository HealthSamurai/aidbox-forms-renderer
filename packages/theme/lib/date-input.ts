import type { ComponentLike } from "./component-like.ts";

export type DateInputProps = {
  id?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
};

export type DateInputComponent = ComponentLike<DateInputProps>;
