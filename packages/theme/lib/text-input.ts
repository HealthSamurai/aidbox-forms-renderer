import type { ComponentType, HTMLAttributes } from "react";
import type { NodePath } from "./path.ts";

export type TextInputProperties = {
  id: string;
  path?: NodePath | undefined;
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
