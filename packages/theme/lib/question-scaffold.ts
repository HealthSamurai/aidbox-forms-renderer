import type { ComponentType, ReactNode } from "react";
import type { CustomExtensionValues } from "./custom-extension.tsx";
import type { NodePath } from "./path.ts";

export type QuestionScaffoldProperties = {
  linkId: string;
  path?: NodePath | undefined;
  header?: ReactNode;
  children: ReactNode;
  errors?: ReactNode;
  signature?: ReactNode;
  isExpandable?: boolean | undefined;
  isExpanded: boolean;
  customExtensions?: CustomExtensionValues | undefined;
};

export type QuestionScaffoldComponent =
  ComponentType<QuestionScaffoldProperties>;
