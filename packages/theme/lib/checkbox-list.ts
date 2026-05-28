import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";
import type { ChoiceOrientation } from "./radio-button-list.ts";

export type CheckboxListProperties = {
  options: readonly OptionItem[];
  selectedOptions: readonly SelectedOptionItem[];
  orientation?: ChoiceOrientation | undefined;
  onSelect: (token: string) => void;
  onDeselect: (token: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
};

export type CheckboxListComponent = ComponentType<CheckboxListProperties>;
