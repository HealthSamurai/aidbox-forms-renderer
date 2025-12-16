import type { ComponentType } from "react";

export type OptionsStatusProps = {
  loading: boolean;
  error?: string | undefined;
};

export type OptionsStatusComponent = ComponentType<OptionsStatusProps>;
