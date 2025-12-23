import type { ComponentType, HTMLAttributes } from "react";

export type TextInputProps = {
  id?: string | undefined;
  type?: string | undefined;
  value: string;
  list?: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
};

export type TextInputComponent = ComponentType<TextInputProps>;
