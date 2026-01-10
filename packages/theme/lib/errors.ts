import type { ComponentType } from "react";

export type ErrorsProperties = {
  id: string;
  messages: string[];
};

export type ErrorsComponent = ComponentType<ErrorsProperties>;
