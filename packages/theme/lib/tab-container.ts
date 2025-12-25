import type { ComponentType, ReactNode } from "react";

export type TabItem = {
  key: string;
  label: ReactNode;
  buttonId: string;
  panelId: string;
  content: ReactNode;
};

export type TabContainerProps = {
  legend?: ReactNode;
  items: TabItem[];
  value: number;
  onChange: (index: number) => void;
  errors?: ReactNode;
  empty?: ReactNode;
  linkId?: string | undefined;
};

export type TabContainerComponent = ComponentType<TabContainerProps>;
