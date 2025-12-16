import type { ComponentType, ReactNode } from "react";

export type AnswerRowProps = {
  control: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
};

export type AnswerRowComponent = ComponentType<AnswerRowProps>;
