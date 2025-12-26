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

export type MultiSelectInputProps = {
  options: OptionEntry<unknown>[];
  value?: string | undefined;
  onChange: (key: string) => void;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  isLoading?: boolean | undefined;
  showOptions?: boolean | undefined;
  chips: MultiSelectChip[];
  actions?: ReactNode;
  dialog?: MultiSelectDialog;
  placeholder?: string | undefined;
};

export type MultiSelectInputComponent = ComponentType<MultiSelectInputProps>;
