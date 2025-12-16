import type { ComponentType } from "react";

export type ReferenceInputProps = {
  reference: string;
  display: string;
  onChangeReference: (value: string) => void;
  onChangeDisplay: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
  referencePlaceholder?: string | undefined;
  displayPlaceholder?: string | undefined;
};

export type ReferenceInputComponent = ComponentType<ReferenceInputProps>;
