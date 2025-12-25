import type { Attachment } from "./fhir-shims.ts";
import type { ComponentType } from "react";

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
