import type { ComponentType, ReactNode } from "react";

export type RadioButtonListProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
  legacyOptionLabel: string | undefined;
  legacyOptionKey: string | undefined;
  inputId: string;
  ariaLabelledBy: string;
  ariaDescribedBy: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProps>;
