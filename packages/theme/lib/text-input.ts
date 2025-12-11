import type { HTMLAttributes } from "react";
import type { ComponentLike } from "./component-like.ts";

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

export type TextInputComponent = ComponentLike<TextInputProps>;
