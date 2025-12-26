import type { ComponentType } from "react";
import type { OptionItem } from "./option-item.ts";

export type SelectInputProps = {
  options: readonly OptionItem[];
  token: string;
  onChange: (token: string) => void;
  legacyOption: OptionItem | null;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled: boolean;
  isLoading?: boolean;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
};

export type SelectInputComponent = ComponentType<SelectInputProps>;
