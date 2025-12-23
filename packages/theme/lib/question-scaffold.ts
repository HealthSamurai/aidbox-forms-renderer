import type { ComponentType, ReactNode } from "react";

export type QuestionScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
};

export type QuestionScaffoldComponent = ComponentType<QuestionScaffoldProps>;
