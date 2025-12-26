import type { ComponentType } from "react";

export type AnswerAddButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

export type AnswerAddButtonComponent = ComponentType<AnswerAddButtonProps>;
