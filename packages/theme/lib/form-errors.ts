import type { ComponentType } from "react";

export type FormErrorsProperties = {
  messages: string[];
};

export type FormErrorsComponent = ComponentType<FormErrorsProperties>;
