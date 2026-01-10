import type { ComponentType, ReactNode } from "react";

export type AnswerScaffoldProperties = {
  control: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  errors?: ReactNode;
  children?: ReactNode;
};

export type AnswerScaffoldComponent = ComponentType<AnswerScaffoldProperties>;
