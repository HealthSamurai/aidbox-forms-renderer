import type { ComponentType, ReactNode } from "react";
import type { OptionItem } from "./option-item.ts";

export type MultiSelectChip = {
  token: string;
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
  options: readonly OptionItem[];
  token?: string | undefined;
  onChange: (token: string) => void;
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
