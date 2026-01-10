import type { ComponentType, ReactNode } from "react";

export type TabItem = {
  token: string;
  label: ReactNode;
  buttonId: string;
  panelId: string;
  content: ReactNode;
};

export type TabContainerProperties = {
  header?: ReactNode;
  items: TabItem[];
  value: number;
  onChange: (index: number) => void;
  errors?: ReactNode;
  empty?: ReactNode;
  linkId: string;
};

export type TabContainerComponent = ComponentType<TabContainerProperties>;
