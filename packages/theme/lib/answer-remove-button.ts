import type { ComponentType } from "react";

export type AnswerRemoveButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export type AnswerRemoveButtonComponent =
  ComponentType<AnswerRemoveButtonProps>;
