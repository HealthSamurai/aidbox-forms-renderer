import type { ComponentType } from "react";

export type OptionsStateProps = {
  loading: boolean;
  error?: string | undefined;
};

export type OptionsStateComponent = ComponentType<OptionsStateProps>;
