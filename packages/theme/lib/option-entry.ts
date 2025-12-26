export type OptionItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

export type OptionEntry<TValue> = OptionItem & {
  value?: TValue;
};
