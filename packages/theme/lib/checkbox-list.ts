import type { ComponentType, ReactNode } from "react";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type CheckboxListProps = {
  options: readonly OptionItem[];
  selectedOptions: readonly SelectedOptionItem[];
  onSelect: (token: string) => void;
  onDeselect: (token: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
};

export type CheckboxListComponent = ComponentType<CheckboxListProps>;
