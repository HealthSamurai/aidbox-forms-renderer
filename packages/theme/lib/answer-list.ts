import type { ComponentType, ReactNode } from "react";

export type AnswerListProps = {
  children: ReactNode;
  onAdd?: (() => void) | undefined;
  canAdd?: boolean | undefined;
  addLabel?: string | undefined;
};

export type AnswerListComponent = ComponentType<AnswerListProps>;
