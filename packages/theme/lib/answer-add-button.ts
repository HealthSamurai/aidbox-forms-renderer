import type { ComponentType } from "react";

export type AnswerAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type AnswerAddButtonComponent = ComponentType<AnswerAddButtonProps>;
