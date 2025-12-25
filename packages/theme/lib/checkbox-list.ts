import type { ComponentType, ReactNode } from "react";

export type CheckboxListProps<TValue = unknown> = {
  options: ReadonlyArray<{
    key: string;
    label: string;
    value: TValue;
    disabled?: boolean;
  }>;
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
