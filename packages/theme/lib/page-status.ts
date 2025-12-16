import type { ComponentType } from "react";

export type PageStatusProps = {
  current: number;
  total: number;
};

export type PageStatusComponent = ComponentType<PageStatusProps>;
