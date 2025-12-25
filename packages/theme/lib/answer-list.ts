import type { ComponentType, ReactNode } from "react";

export type AnswerListProps = {
  children: ReactNode;
  toolbar?: ReactNode;
};

export type AnswerListComponent = ComponentType<AnswerListProps>;
