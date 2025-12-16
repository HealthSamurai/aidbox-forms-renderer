import type { ComponentType } from "react";

export type CodingInputProps = {
  system: string;
  code: string;
  display: string;
  onChangeSystem: (value: string) => void;
  onChangeCode: (value: string) => void;
  onChangeDisplay: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
  systemPlaceholder?: string | undefined;
  codePlaceholder?: string | undefined;
  displayPlaceholder?: string | undefined;
};

export type CodingInputComponent = ComponentType<CodingInputProps>;
