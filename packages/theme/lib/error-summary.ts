import type { ComponentType } from "react";

export type ErrorSummaryItem = {
  href?: string | undefined;
  message: string;
};

export type ErrorSummaryProperties = {
  id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  items: ErrorSummaryItem[];
};

export type ErrorSummaryComponent = ComponentType<ErrorSummaryProperties>;
