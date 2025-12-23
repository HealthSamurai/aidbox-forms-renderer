import type { ComponentType, ReactNode } from "react";

export type RadioGroupProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  selectValue: string;
  onChange: (value: string) => void;
  legacyOptionLabel: string | undefined;
  legacyOptionKey: string | undefined;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
  after?: ReactNode;
  afterInset?: boolean;
};

export type RadioGroupComponent = ComponentType<RadioGroupProps>;
