import type { ComponentType, ReactNode } from "react";
import type { CustomExtensionValues } from "./custom-extension.tsx";
import type { NodePath } from "./path.ts";

export type GroupListProperties = {
  linkId: string;
  header?: ReactNode;
  errors?: ReactNode;
  children: ReactNode;
  onAdd?: (() => void) | undefined;
  canAdd?: boolean | undefined;
  path?: NodePath | undefined;
  count?: number | undefined;
  customExtensions?: CustomExtensionValues | undefined;
};

export type GroupListComponent = ComponentType<GroupListProperties>;
