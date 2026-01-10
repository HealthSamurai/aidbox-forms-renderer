import type { ComponentType, ReactNode } from "react";

export type GroupListProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
  onAdd?: (() => void) | undefined;
  canAdd?: boolean | undefined;
  addLabel?: string | undefined;
};

export type GroupListComponent = ComponentType<GroupListProps>;
