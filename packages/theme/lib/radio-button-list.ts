import type { ComponentType, ReactNode } from "react";
import type { OptionItem } from "./option-item.ts";

export type RadioButtonListProps = {
  options: readonly OptionItem[];
  token: string;
  onChange: (token: string) => void;
  legacyOption: OptionItem | null;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProps>;
