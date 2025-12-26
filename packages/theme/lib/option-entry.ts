export type OptionItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

export type OptionValueEntry<TValue> = OptionItem & {
  value: TValue;
};

export type OptionEntry<TValue> = OptionItem & {
  value?: TValue;
};
