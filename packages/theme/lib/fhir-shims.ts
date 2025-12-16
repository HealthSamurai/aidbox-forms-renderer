// Minimal FHIR Attachment shape used by theme props without depending on fhir/r5.
export type Attachment = {
  title?: string | undefined;
  url?: string | undefined;
  size?: number | string | undefined;
  contentType?: string | undefined;
  data?: string | undefined;
};
