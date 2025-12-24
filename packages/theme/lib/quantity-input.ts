import type { ComponentType } from "react";

export type QuantityUnitOption = {
  key: string;
  label: string;
  disabled?: boolean | undefined;
};

export type QuantityInputProps = {
  value: number | null;
  onChangeValue: (raw: string) => void;
  unitOptions: ReadonlyArray<QuantityUnitOption>;
  unitValue: string;
  onSelectUnit: (key: string) => void;
  onChangeFreeTextUnit: (text: string) => void;
  isUnitFreeForm: boolean;
  inputId?: string | undefined;
  placeholder?: string | undefined;
  unitPlaceholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export type QuantityInputComponent = ComponentType<QuantityInputProps>;
