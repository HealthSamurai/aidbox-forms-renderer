import type { ComponentType } from "react";

export type OptionAutocompleteFieldProps<TValue = unknown> = {
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
};

export type OptionAutocompleteFieldComponent =
  ComponentType<OptionAutocompleteFieldProps>;
