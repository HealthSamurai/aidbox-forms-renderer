import type { Attachment, Quantity, Reference } from "fhir/r5";

import type { AnswerPrimitive } from "../types";

export function coerceAttachment(value: AnswerPrimitive | undefined): Attachment | undefined {
  if (value && typeof value === "object" && "url" in value) {
    return value as Attachment;
  }
  return undefined;
}

export function coerceReference(value: AnswerPrimitive | undefined): Reference | undefined {
  if (value && typeof value === "object" && ("reference" in value || "display" in value)) {
    return value as Reference;
  }
  return undefined;
}

export function coerceQuantity(value: AnswerPrimitive | undefined): Quantity | undefined {
  if (value && typeof value === "object" && ("value" in value || "unit" in value)) {
    return value as Quantity;
  }
  return undefined;
}
