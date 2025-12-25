import type { ComponentType, ReactNode } from "react";

export type AnswerScaffoldProps = {
  control: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
};

export type AnswerScaffoldComponent = ComponentType<AnswerScaffoldProps>;
