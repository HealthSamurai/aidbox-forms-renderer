import type { ComponentType, ReactNode } from "react";

export type RadioButtonListProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
  legacyOption: { key: string; label: string } | null;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export type RadioButtonListComponent = ComponentType<RadioButtonListProps>;
