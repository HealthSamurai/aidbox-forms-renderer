import type { ReactElement } from "react";
import type { ComponentLike } from "./component-like.ts";

export type TypedSuggestionInputProps<TValue = unknown> = {
  renderInput: () => ReactElement;
  options: ReadonlyArray<{ key: string; label: string; value: TValue }>;
  onSelect: (value: TValue | string) => void;
  isLoading?: boolean;
  readOnly?: boolean;
  currentValue: unknown;
};

export type TypedSuggestionInputComponent =
  ComponentLike<TypedSuggestionInputProps>;
