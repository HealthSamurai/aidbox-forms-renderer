import type { ComponentType } from "react";

export type Attachment = {
  title?: string | undefined;
  url?: string | undefined;
  size?: number | string | undefined;
  contentType?: string | undefined;
  data?: string | undefined;
};

export type FileInputProps = {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  sizeLabel?: string | undefined;
  filename?: string | undefined;
  onFileSelect?: ((file: File) => void) | undefined;
  onClear?: (() => void) | undefined;
};

export type FileInputComponent = ComponentType<FileInputProps>;
