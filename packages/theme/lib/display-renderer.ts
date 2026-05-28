import type { ComponentType, ReactNode } from "react";
import type { CustomExtensionValues } from "./custom-extension.tsx";

export type DisplayRendererProperties = {
  linkId: string;
  children: ReactNode;
  customExtensions?: CustomExtensionValues | undefined;
};

export type DisplayRendererComponent = ComponentType<DisplayRendererProperties>;
