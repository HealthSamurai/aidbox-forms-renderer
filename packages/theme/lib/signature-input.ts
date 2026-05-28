import type { ComponentType } from "react";
import type { NodePath } from "./path.ts";

export type SignatureInputProperties = {
  value: string | undefined;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  onChange?: ((value?: string) => void) | undefined;
};

export type SignatureInputComponent = ComponentType<SignatureInputProperties>;
