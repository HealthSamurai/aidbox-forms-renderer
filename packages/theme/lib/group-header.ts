import type { ComponentType, ReactNode } from "react";

export type GroupHeaderProps = {
  control: ReactNode;
  errors?: ReactNode;
  toolbar?: ReactNode;
};

export type GroupHeaderComponent = ComponentType<GroupHeaderProps>;
