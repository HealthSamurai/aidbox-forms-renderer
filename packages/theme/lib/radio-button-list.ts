import type { ComponentType, ReactNode } from "react";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type RadioButtonListProps = {
  options: readonly OptionItem[];
  selectedOption: SelectedOptionItem | null;
  onChange: (token: string | null) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProps>;
