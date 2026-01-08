import type { ComponentType } from "react";

export type AnswerRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type AnswerRemoveButtonComponent =
  ComponentType<AnswerRemoveButtonProps>;
