import type {
  Attachment,
  Coding,
  Quantity,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItemAnswer,
  Reference,
} from "fhir/r5";
import type { AnswerPrimitive } from "../types";
import type { QuestionnaireIndex } from "./questionnaire-index";
import { locateResponseItem } from "./qr-locator";

/**
 * Type-aware read/write helpers for primitive answers. Each helper operates on
 * the canonical QuestionnaireResponse to avoid keeping a second copy of state
 * or dropping nested answer items.
 */

const nonPrimitiveTypes = new Set<QuestionnaireItem["type"]>([
  "group",
  "display",
  "question",
]);

export function readAnswerPrimitive(
  index: QuestionnaireIndex,
  response: QuestionnaireResponse,
  item: QuestionnaireItem,
): AnswerPrimitive | undefined {
  if (nonPrimitiveTypes.has(item.type)) {
    return undefined;
  }

  const target = locateResponseItem(index, response, item.linkId);

  if (!target.item || !target.item.answer || target.item.answer.length === 0) {
    return undefined;
  }

  const answer = target.item.answer[0];

  if (!answer) {
    return undefined;
  }

  switch (item.type) {
    case "boolean":
      return answer.valueBoolean;
    case "integer":
      return answer.valueInteger;
    case "decimal":
      return answer.valueDecimal ?? answer.valueInteger;
    case "date":
      return answer.valueDate;
    case "dateTime":
      return answer.valueDateTime;
    case "time":
      return answer.valueTime;
    case "text":
    case "string":
    case "url":
      return answer.valueString;
    case "coding":
      return answer.valueCoding ?? answer.valueString;
    case "attachment":
      return answer.valueAttachment;
    case "reference":
      return answer.valueReference;
    case "quantity":
      return answer.valueQuantity;
    case "group":
    case "display":
    case "question":
      return assertUnsupportedType(item.type);
  }
}

export function writeAnswerPrimitive(
  index: QuestionnaireIndex,
  response: QuestionnaireResponse,
  item: QuestionnaireItem,
  value: AnswerPrimitive | undefined,
): void {
  if (value === undefined) {
    clearAnswerPrimitive(index, response, item);
    return;
  }

  if (nonPrimitiveTypes.has(item.type)) {
    return;
  }

  const target = locateResponseItem(index, response, item.linkId, {
    create: true,
  });

  if (!target.item) {
    return;
  }

  const previous = target.item.answer?.[0];
  const preservedItems =
    previous?.item && previous.item.length > 0 ? previous.item : undefined;
  const answer = buildAnswer(item, value, preservedItems);

  target.item.answer = [answer];
}

export function clearAnswerPrimitive(
  index: QuestionnaireIndex,
  response: QuestionnaireResponse,
  item: QuestionnaireItem,
): void {
  const target = locateResponseItem(index, response, item.linkId);

  if (!target.item) {
    return;
  }

  if (!target.item.answer || target.item.answer.length === 0) {
    return;
  }

  const current = target.item.answer[0];

  if (current?.item && current.item.length > 0) {
    stripAnswerValue(current);
    target.item.answer = [current];
  } else {
    delete target.item.answer;
  }
}

function stripAnswerValue(answer: QuestionnaireResponseItemAnswer) {
  delete answer.valueBoolean;
  delete answer.valueInteger;
  delete answer.valueDecimal;
  delete answer.valueString;
  delete answer.valueDate;
  delete answer.valueTime;
  delete answer.valueDateTime;
  delete answer.valueUri;
  delete answer.valueCoding;
  delete answer.valueAttachment;
  delete answer.valueReference;
  delete answer.valueQuantity;
}

function buildAnswer(
  item: QuestionnaireItem,
  value: AnswerPrimitive,
  preservedItems?: QuestionnaireResponseItemAnswer["item"],
): QuestionnaireResponseItemAnswer {
  const answer: QuestionnaireResponseItemAnswer = {};

  switch (item.type) {
    case "boolean":
      answer.valueBoolean = Boolean(value);
      break;
    case "integer":
      if (typeof value === "number") {
        answer.valueInteger = Number.isFinite(value) ? value : undefined;
      }
      break;
    case "decimal":
      if (typeof value === "number") {
        answer.valueDecimal = Number.isFinite(value) ? value : undefined;
      }
      break;
    case "date":
      if (typeof value === "string") {
        answer.valueDate = value;
      }
      break;
    case "dateTime":
      if (typeof value === "string") {
        answer.valueDateTime = value;
      }
      break;
    case "time":
      if (typeof value === "string") {
        answer.valueTime = value;
      }
      break;
    case "text":
    case "string":
    case "url":
      if (typeof value === "string") {
        answer.valueString = value;
      }
      break;
    case "coding":
      if (typeof value === "string") {
        answer.valueString = value;
      } else if (value && typeof value === "object") {
        const codingValue = value as Coding;
        answer.valueCoding = {
          code: codingValue.code,
          display: codingValue.display,
          system: codingValue.system,
        };
      }
      break;
    case "attachment":
      if (value && typeof value === "object") {
        answer.valueAttachment = value as Attachment;
      }
      break;
    case "reference":
      if (value && typeof value === "object") {
        answer.valueReference = value as Reference;
      }
      break;
    case "quantity":
      if (value && typeof value === "object") {
        answer.valueQuantity = value as Quantity;
      }
      break;
    case "group":
    case "display":
    case "question":
      return assertUnsupportedType(item.type);
  }

  if (preservedItems && preservedItems.length > 0) {
    answer.item = preservedItems;
  }

  return answer;
}

function assertUnsupportedType(type: QuestionnaireItem["type"]): never {
  throw new Error(`Unsupported questionnaire item type: ${type as string}`);
}
