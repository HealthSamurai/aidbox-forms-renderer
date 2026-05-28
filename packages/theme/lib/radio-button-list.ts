import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";
import type { OptionItem, SelectedOptionItem } from "./option-item.ts";

export type ChoiceOrientation = "horizontal" | "vertical";

export type RadioButtonListProperties = {
  options: readonly OptionItem[];
  selectedOption: SelectedOptionItem | undefined;
  orientation?: ChoiceOrientation | undefined;
  onChange: (token?: string) => void;
  specifyOtherOption?: OptionItem | undefined;
  customOptionForm?: ReactNode;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProperties>;
