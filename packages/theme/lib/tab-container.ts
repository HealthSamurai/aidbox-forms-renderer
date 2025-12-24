import type { ComponentType, ReactNode } from "react";

export type TabItem = {
  key: string;
  label: ReactNode;
  tabButtonId: string;
  tabPanelId: string;
  content: ReactNode;
};

export type TabContainerProps = {
  legend?: ReactNode;
  items: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  errors?: ReactNode;
  empty?: ReactNode;
  linkId?: string | undefined;
};

export type TabContainerComponent = ComponentType<TabContainerProps>;
