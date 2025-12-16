import type { ComponentType } from "react";

export type FormErrorsProps = {
  messages: string[];
};

export type FormErrorsComponent = ComponentType<FormErrorsProps>;
