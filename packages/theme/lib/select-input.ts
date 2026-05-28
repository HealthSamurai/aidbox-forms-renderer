import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type SelectInputProperties = {
  options: readonly OptionItem[];
  selectedOption: SelectedOptionItem | undefined;
  searchQuery: string;
  onChange: (token?: string) => void;
  onSearch?: (query: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  placeholder?: string | undefined;
};

export type SelectInputComponent = ComponentType<SelectInputProperties>;
