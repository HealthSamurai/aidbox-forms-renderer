import type { ComponentType, ReactNode } from "react";

export type RepeatingGroupListProps = {
  linkId: string;
  legend?: ReactNode;
  items: ReactNode;
  toolbar?: ReactNode;
};

export type RepeatingGroupListComponent =
  ComponentType<RepeatingGroupListProps>;
