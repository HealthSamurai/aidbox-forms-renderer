import type { ComponentType } from "react";

export type Attachment = {
  title?: string | undefined;
  url?: string | undefined;
  size?: number | undefined;
  contentType?: string | undefined;
  data?: string | undefined;
};

export type FileInputProperties = {
  value: Attachment | undefined;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  accept?: string | undefined;
  onChange?: ((file?: File) => void) | undefined;
};

export type FileInputComponent = ComponentType<FileInputProperties>;
