import type { ComponentType } from "react";

export type PageNavigationProps = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev: boolean;
  disabledNext: boolean;
};

export type PageNavigationComponent = ComponentType<PageNavigationProps>;
