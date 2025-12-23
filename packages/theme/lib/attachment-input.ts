import type { Attachment } from "./fhir-shims.ts";
import type { ComponentType } from "react";

export type AttachmentInputProps = {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
  sizeLabel?: string | undefined;
  filename?: string | undefined;
  onFileSelect?: ((file: File) => void) | undefined;
  onClear?: (() => void) | undefined;
};

export type AttachmentInputComponent = ComponentType<AttachmentInputProps>;
