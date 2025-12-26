import type { ReactNode } from "react";

export type OptionItem = {
  token: string;
  label: ReactNode;
  disabled?: boolean;
};
