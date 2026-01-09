import type { ComponentType, ReactNode } from "react";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type SelectInputProps = {
  options: readonly OptionItem[];
  selectedOption: SelectedOptionItem | null;
  onChange: (token: string | null) => void;
  onSearch?: (query: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  placeholder?: string | undefined;
};

export type SelectInputComponent = ComponentType<SelectInputProps>;
