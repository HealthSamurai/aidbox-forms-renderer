import type { ComponentType, ReactNode } from "react";

export type GroupWrapperScaffoldProps = {
  linkId: string;
  header?: ReactNode;
  children: ReactNode;
  onAdd?: (() => void) | undefined;
  canAdd?: boolean | undefined;
  addLabel?: string | undefined;
};

export type GroupWrapperScaffoldComponent =
  ComponentType<GroupWrapperScaffoldProps>;
