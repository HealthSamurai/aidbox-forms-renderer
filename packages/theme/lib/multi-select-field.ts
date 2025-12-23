import type { ComponentType, ReactNode } from "react";
import type { OptionEntry } from "./option-entry.ts";

export type MultiSelectChip = {
  key: string;
  content: ReactNode;
  errors?: ReactNode;
  onRemove?: (() => void) | undefined;
  removeDisabled?: boolean | undefined;
  removeLabel?: string | undefined;
};

export type MultiSelectDialog = {
  open: boolean;
  title: string;
  content: ReactNode;
  actions: ReactNode;
};

export type MultiSelectFieldProps = {
  mode: "select" | "autocomplete" | "lookup";
  options: ReadonlyArray<OptionEntry<unknown>>;
  selectValue?: string | undefined;
  onSelectOption: (key: string) => void;
  searchValue?: string | undefined;
  onSearchValueChange?: ((value: string) => void) | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  readOnly?: boolean | undefined;
  isLoading?: boolean | undefined;
  showOptions?: boolean | undefined;
  chips: ReadonlyArray<MultiSelectChip>;
  actions?: ReactNode;
  dialog?: MultiSelectDialog;
  selectPlaceholder?: string | undefined;
  searchPlaceholder?: string | undefined;
};

export type MultiSelectFieldComponent = ComponentType<MultiSelectFieldProps>;
