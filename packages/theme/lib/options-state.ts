import type { ComponentType } from "react";

export type OptionsStateProps = {
  isLoading: boolean;
  error?: string | undefined;
};

export type OptionsStateComponent = ComponentType<OptionsStateProps>;
