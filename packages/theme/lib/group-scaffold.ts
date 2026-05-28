import type { ComponentType, ReactNode } from "react";
import type { CustomExtensionValues } from "./custom-extension.tsx";
import type { NodePath } from "./path.ts";

export type GroupScaffoldProperties = {
  linkId?: string | undefined;
  path?: NodePath | undefined;
  header?: ReactNode;
  children?: ReactNode;
  errors?: ReactNode;
  signature?: ReactNode;
  isExpandable?: boolean | undefined;
  isExpanded: boolean;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  customExtensions?: CustomExtensionValues | undefined;
};

export type GroupScaffoldComponent = ComponentType<GroupScaffoldProperties>;
