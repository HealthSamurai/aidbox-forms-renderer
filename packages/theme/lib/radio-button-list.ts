import type { ComponentType, ReactNode } from "react";
import type { OptionItem } from "./option-entry.ts";

export type RadioButtonListProps = {
  options: readonly OptionItem[];
  value: string;
  onChange: (value: string) => void;
  legacyOption: { key: string; label: string } | null;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProps>;
