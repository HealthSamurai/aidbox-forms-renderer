import type { ReactNode } from "react";
import type { ComponentLike } from "./component-like.ts";

export type OptionCheckboxGroupProps<TValue = unknown> = {
  options: ReadonlyArray<{
    key: string;
    label: string;
    value: TValue;
    disabled?: boolean;
  }>;
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
  inputName: string;
  labelId: string;
  describedById?: string | undefined;
  readOnly?: boolean;
  isLoading?: boolean;
  renderErrors?: (key: string) => ReactNode;
};

export type OptionCheckboxGroupComponent =
  ComponentLike<OptionCheckboxGroupProps>;
