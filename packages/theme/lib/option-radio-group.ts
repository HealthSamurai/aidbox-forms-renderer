import type { ComponentLike } from "./component-like.ts";

export type OptionRadioGroupProps = {
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
};

export type OptionRadioGroupComponent = ComponentLike<OptionRadioGroupProps>;
