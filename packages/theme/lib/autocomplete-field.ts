import type { ComponentType, ReactNode } from "react";

export type AutocompleteFieldProps<TValue = unknown> = {
  options: ReadonlyArray<{ key: string; label: string; value: TValue }>;
  selectValue: string;
  legacyOptionLabel: string | undefined;
  onSelect: (key: string) => void;
  inputId: string;
  labelId: string;
  describedById?: string | undefined;
  readOnly: boolean;
  mode: "autocomplete" | "lookup";
  isLoading?: boolean;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
  valueDisplay?: ReactNode;
};

export type AutocompleteFieldComponent = ComponentType<AutocompleteFieldProps>;
