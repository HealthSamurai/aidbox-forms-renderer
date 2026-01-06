import type { ReactNode } from "react";

export type OptionItem = {
  token: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectedOptionItem = OptionItem & {
  ariaDescribedBy?: string | undefined;
  errors?: ReactNode;
};
