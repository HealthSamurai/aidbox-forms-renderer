import type { ComponentType, HTMLAttributes } from "react";

export type TextInputProperties = {
  id: string;
  type?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
};

export type TextInputComponent = ComponentType<TextInputProperties>;
