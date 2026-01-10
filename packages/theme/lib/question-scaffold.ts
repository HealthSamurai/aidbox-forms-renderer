import type { ComponentType, ReactNode } from "react";

export type QuestionScaffoldProperties = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
};

export type QuestionScaffoldComponent =
  ComponentType<QuestionScaffoldProperties>;
