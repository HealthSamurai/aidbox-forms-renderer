import type { ComponentType } from "react";
import type { NodePath } from "./path.ts";

export type DateTimeInputProperties = {
  id: string;
  path?: NodePath | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
};

export type DateTimeInputComponent = ComponentType<DateTimeInputProperties>;
