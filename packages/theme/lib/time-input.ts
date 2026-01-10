import type { ComponentType } from "react";

export type TimeInputProperties = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
};

export type TimeInputComponent = ComponentType<TimeInputProperties>;
