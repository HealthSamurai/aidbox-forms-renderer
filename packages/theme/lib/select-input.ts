import type { ComponentType } from "react";

export type SelectInputProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  selectValue: string;
  onChange: (key: string) => void;
  legacyOption: { key: string; label: string } | null;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
};

export type SelectInputComponent = ComponentType<SelectInputProps>;
