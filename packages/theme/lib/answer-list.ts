import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type AnswerListProperties = {
  children: ReactNode;
  onAdd?: (() => void) | undefined;
  canAdd?: boolean | undefined;
  path?: NodePath | undefined;
};

export type AnswerListComponent = ComponentType<AnswerListProperties>;
