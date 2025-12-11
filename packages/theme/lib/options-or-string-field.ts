import type { ReactElement } from "react";
import type { ComponentLike } from "./component-like.ts";

export type OptionsOrStringFieldProps<TValue = unknown> = {
  options: ReadonlyArray<{
    key: string;
    label: string;
    value?: TValue;
    disabled: boolean;
  }>;
  renderInput: () => ReactElement;
  getValueForKey: (key: string) => TValue | null;
  customOptionKey: string;
  selectValue: string;
  onSelectValue: (value: TValue | null) => void;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
};

export type OptionsOrStringFieldComponent =
  ComponentLike<OptionsOrStringFieldProps>;
