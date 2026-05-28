import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type CheckboxProperties = {
  id: string;
  path?: NodePath | undefined;
  checkedValue?: string | undefined;
  uncheckedValue?: string | undefined;
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  label?: ReactNode;
};

export type CheckboxComponent = ComponentType<CheckboxProperties>;
