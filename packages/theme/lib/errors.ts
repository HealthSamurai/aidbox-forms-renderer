import type { ComponentType } from "react";

export type ErrorsProps = {
  id?: string | undefined;
  messages: string[];
};

export type ErrorsComponent = ComponentType<ErrorsProps>;
