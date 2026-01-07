import type { ComponentType, ReactNode } from "react";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type MultiSelectInputProps = {
  options: readonly OptionItem[];
  selectedOptions: readonly SelectedOptionItem[];
  onSelect: (token: string) => void;
  onDeselect: (token: string) => void;
  onSearch?: (query: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  placeholder?: string | undefined;
};

export type MultiSelectInputComponent = ComponentType<MultiSelectInputProps>;
