import type { ReactNode } from "react";

export type OptionItem = {
  token: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectedOptionItem = OptionItem & {
  errors?: ReactNode;
};
