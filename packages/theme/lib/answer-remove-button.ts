import type { ComponentType } from "react";

export type AnswerRemoveButtonProperties = {
  onClick: () => void;
  disabled: boolean;
  text: string;
};

export type AnswerRemoveButtonComponent =
  ComponentType<AnswerRemoveButtonProperties>;
