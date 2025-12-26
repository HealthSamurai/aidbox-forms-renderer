import type { ComponentType, ReactNode } from "react";

export type AnswerRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children?: ReactNode;
};

export type AnswerRemoveButtonComponent =
  ComponentType<AnswerRemoveButtonProps>;
