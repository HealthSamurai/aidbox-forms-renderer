import type { ComponentType, ReactNode } from "react";

export type AnswerListProps = {
  answers: ReactNode;
  toolbar?: ReactNode;
};

export type AnswerListComponent = ComponentType<AnswerListProps>;
