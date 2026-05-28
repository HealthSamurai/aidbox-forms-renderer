import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type AnswerScaffoldProperties = {
  control: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  errors?: ReactNode;
  children?: ReactNode;
  path?: NodePath | undefined;
};

export type AnswerScaffoldComponent = ComponentType<AnswerScaffoldProperties>;
