import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type TabItem = {
  token: string;
  label: ReactNode;
  buttonId: string;
  panelId: string;
  content: ReactNode;
};

export type TabContainerProperties = {
  path?: NodePath | undefined;
  header?: ReactNode;
  items: TabItem[];
  value: number;
  onChange: (index: number) => void;
  errors?: ReactNode;
  linkId: string;
};

export type TabContainerComponent = ComponentType<TabContainerProperties>;
