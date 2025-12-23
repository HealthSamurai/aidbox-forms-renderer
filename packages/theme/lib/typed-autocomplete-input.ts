import type { ComponentType, ReactElement } from "react";

export type TypedAutocompleteInputProps<TValue = unknown> = {
  renderInput: () => ReactElement;
  options: ReadonlyArray<{ key: string; label: string; value: TValue }>;
  onSelect: (value: TValue | string) => void;
  isLoading?: boolean;
  readOnly?: boolean;
  currentValue: unknown;
};

export type TypedAutocompleteInputComponent =
  ComponentType<TypedAutocompleteInputProps>;
