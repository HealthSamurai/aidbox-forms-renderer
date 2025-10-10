import type { Attachment, Coding, Quantity, Reference } from "fhir/r5";

export type AnswerPrimitive =
  | string
  | number
  | boolean
  | Coding
  | Attachment
  | Reference
  | Quantity;
