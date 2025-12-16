import type { ComponentType } from "react";

export type TextAreaProps = {
  id?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
};

export type TextAreaComponent = ComponentType<TextAreaProps>;
