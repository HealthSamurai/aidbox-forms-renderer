import type { ComponentType } from "react";
import type { OptionItem } from "./option-entry.ts";

export type SelectInputProps = {
  options: OptionItem[];
  value: string;
  onChange: (key: string) => void;
  legacyOption: { key: string; label: string } | null;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled: boolean;
  isLoading?: boolean;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
};

export type SelectInputComponent = ComponentType<SelectInputProps>;
