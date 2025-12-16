import type { ComponentType, ReactNode } from "react";

export type GroupItemProps = {
  control: ReactNode;
  errors?: ReactNode;
  toolbar?: ReactNode;
};

export type GroupItemComponent = ComponentType<GroupItemProps>;
