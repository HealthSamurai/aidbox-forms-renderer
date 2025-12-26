import type { ComponentType, ReactNode } from "react";
import type { OptionValueEntry } from "./option-entry.ts";

export type CheckboxListProps<TValue = unknown> = {
  options: readonly OptionValueEntry<TValue>[];
  value: Set<string>;
  onChange: (key: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  isLoading?: boolean;
  renderErrors?: (key: string) => ReactNode;
  after?: ReactNode;
};

export type CheckboxListComponent = ComponentType<CheckboxListProps>;
