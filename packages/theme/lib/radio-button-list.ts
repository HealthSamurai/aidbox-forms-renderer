import type { ComponentType, ReactNode } from "react";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type RadioButtonListProperties = {
  options: readonly OptionItem[];
  selectedOption: SelectedOptionItem | undefined;
  onChange: (token?: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProperties>;
