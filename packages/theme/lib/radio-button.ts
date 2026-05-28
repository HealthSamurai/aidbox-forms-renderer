import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type RadioButtonProperties = {
  id: string;
  path?: NodePath | undefined;
  groupName: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
};

export type RadioButtonComponent = ComponentType<RadioButtonProperties>;
