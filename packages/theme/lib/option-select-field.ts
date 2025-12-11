import type { ComponentLike } from "./component-like.ts";

export type OptionSelectFieldProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  selectValue: string;
  onChange: (key: string) => void;
  legacyOption: { key: string; label: string } | null;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
};

export type OptionSelectFieldComponent = ComponentLike<OptionSelectFieldProps>;
