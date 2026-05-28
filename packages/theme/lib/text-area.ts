import type { ComponentType, HTMLAttributes } from "react";
import type { NodePath } from "./path.ts";

export type TextAreaProperties = {
  id: string;
  path?: NodePath | undefined;
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

export type TextAreaComponent = ComponentType<TextAreaProperties>;
