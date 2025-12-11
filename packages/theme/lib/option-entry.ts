export type OptionEntry<TValue> = {
  key: string;
  label: string;
  value?: TValue;
  disabled?: boolean;
};
