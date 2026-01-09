import type { ComponentType } from "react";

export type ErrorsProps = {
  id: string;
  messages: string[];
};

export type ErrorsComponent = ComponentType<ErrorsProps>;
