import type { ComponentType, ReactNode } from "react";
import type { OptionItem } from "./option-item.ts";

export type CheckboxListProps = {
  options: readonly OptionItem[];
  tokens: Set<string>;
  onChange: (token: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  isLoading?: boolean;
  renderErrors?: (token: string) => ReactNode;
  after?: ReactNode;
};

export type CheckboxListComponent = ComponentType<CheckboxListProps>;
