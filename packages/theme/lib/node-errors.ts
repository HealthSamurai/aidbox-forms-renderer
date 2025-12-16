import type { ComponentType } from "react";

export type NodeErrorsProps = {
  id?: string | undefined;
  messages: string[];
};

export type NodeErrorsComponent = ComponentType<NodeErrorsProps>;
