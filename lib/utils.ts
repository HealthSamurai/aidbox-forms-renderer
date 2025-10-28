import {
  AnswerableQuestionType,
  AnswerValueFor,
  IAnswerInstance,
  IDisplayStore,
  IGroupStore,
  INodeStore,
  INonRepeatingGroupStore,
  IQuestionStore,
  IRepeatingGroupInstance,
  IRepeatingGroupStore,
} from "./stores/types.ts";
import type {
  Attachment,
  Coding,
  Element,
  Extension,
  OperationOutcomeIssue,
  Quantity,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  Reference,
} from "fhir/r5";

export function getItemLabelId(item: INodeStore): string {
  return `af-${item.path}-label`;
}

export function getItemHelpId(item: INodeStore): string {
  return `af-${item.path}-help`;
}

export function getItemErrorId(item: INodeStore): string {
  return `af-${item.path}-errors`;
}

export function isDisplay(it: INodeStore | undefined): it is IDisplayStore {
  return it?.type === "display";
}

export function isGroup(it: INodeStore | undefined): it is IGroupStore {
  return it?.type === "group";
}

export function isRepeatingGroup(
  it: INodeStore | undefined,
): it is IRepeatingGroupStore {
  return it?.type === "group" && it.repeats;
}

export function isNonRepeatingGroup(
  it: INodeStore | undefined,
): it is INonRepeatingGroupStore {
  return it?.type === "group" && !it.repeats;
}

export function isQuestion<
  TType extends AnswerableQuestionType = AnswerableQuestionType,
>(it: INodeStore | undefined): it is IQuestionStore<TType> {
  return it?.type !== "group" && it?.type !== "display";
}

export const EXT = {
  MIN: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  MAX: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  HIDDEN: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
  SDC_ENABLE:
    "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression",
  SDC_CALC:
    "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
  SDC_INIT:
    "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
  SDC_MIN_VALUE: "http://hl7.org/fhir/StructureDefinition/minValue",
  SDC_MAX_VALUE: "http://hl7.org/fhir/StructureDefinition/maxValue",
} as const;

export function findExtension(
  element: Element,
  url: string,
): Extension | undefined {
  return element.extension?.find((e) => e.url === url);
}

export function isQuantity(value: unknown): value is Quantity {
  return typeof value === "object" && value !== null && "value" in value;
}

export function getIntegerBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueInteger;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueInteger;
  return {
    min: typeof min === "number" ? min : undefined,
    max: typeof max === "number" ? max : undefined,
  };
}

export function getDecimalBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueDecimal;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueDecimal;
  return {
    min: typeof min === "number" ? min : undefined,
    max: typeof max === "number" ? max : undefined,
  };
}

export function getDateBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueDate;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueDate;
  return {
    min: typeof min === "string" ? min : undefined,
    max: typeof max === "string" ? max : undefined,
  };
}

export function getDateTimeBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueDateTime;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueDateTime;
  return {
    min: typeof min === "string" ? min : undefined,
    max: typeof max === "string" ? max : undefined,
  };
}

export function getTimeBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueTime;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueTime;
  return {
    min: typeof min === "string" ? min : undefined,
    max: typeof max === "string" ? max : undefined,
  };
}

export function getQuantityBounds(item: QuestionnaireItem) {
  const min = findExtension(item, EXT.SDC_MIN_VALUE)?.valueQuantity;
  const max = findExtension(item, EXT.SDC_MAX_VALUE)?.valueQuantity;
  return {
    min: isQuantity(min) ? min : undefined,
    max: isQuantity(max) ? max : undefined,
  };
}

export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: ReadonlyArray<K>,
): Omit<T, K> {
  const result = { ...source } as T;
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

export async function prepareAttachmentFromFile(
  file: File,
  existing: Attachment,
): Promise<Attachment> {
  const result = await new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  if (typeof result !== "string") {
    return existing;
  }

  const [, base64] = result.split(",");
  const updated: Attachment = {
    ...existing,
    data: base64 ?? undefined,
    title: existing.title ?? file.name,
  };

  const contentType = file.type || existing.contentType;
  updated.contentType = contentType || undefined;

  return updated;
}

export function pruneAttachment(value: Attachment): Attachment | null {
  const next: Attachment = { ...value };
  for (const key of Object.keys(next) as (keyof Attachment)[]) {
    const candidate = next[key];
    const shouldDrop =
      candidate === undefined ||
      candidate === null ||
      candidate === "" ||
      (Array.isArray(candidate) && candidate.length === 0);
    if (shouldDrop) {
      delete next[key];
    }
  }
  return Object.keys(next).length > 0 ? next : null;
}

export function instanceHasResponses(
  instance: IRepeatingGroupInstance,
): boolean {
  return instance.children.some((child) => child.responseItems.length > 0);
}

export function makeIssue(
  code: OperationOutcomeIssue["code"],
  diagnostics: string,
): OperationOutcomeIssue {
  return {
    severity: "error",
    code,
    diagnostics,
  };
}

export function answerHasOwnValue(answer: IAnswerInstance<unknown>): boolean {
  const value = answer.value;
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  return true;
}

export function answerHasContent<T extends AnswerableQuestionType>(
  answer: IAnswerInstance<AnswerValueFor<T>>,
): boolean {
  if (answer.children.some((child) => child.responseItems.length > 0)) {
    return true;
  }

  return answerHasOwnValue(answer);
}

export function getItemDescribedBy<T extends AnswerableQuestionType>(
  item: IQuestionStore<T>,
) {
  const describedByPieces = [
    item.help ? getItemHelpId(item) : undefined,
    item.hasErrors ? getItemErrorId(item) : undefined,
  ].filter(Boolean) as string[];
  return describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;
}

export function sanitizeForId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

// prettier-ignore
type KeySuffixFor<T extends AnswerableQuestionType> =
  T extends "boolean"    ? "Boolean"   :
  T extends "decimal"    ? "Decimal"   :
  T extends "integer"    ? "Integer"   :
  T extends "date"       ? "Date"      :
  T extends "dateTime"   ? "DateTime"  :
  T extends "time"       ? "Time"      :
  T extends "string"     ? "String"    :
  T extends "text"       ? "String"    : // text -> String
  T extends "url"        ? "Uri"       : // url  -> Uri
  T extends "coding"     ? "Coding"    :
  T extends "attachment" ? "Attachment":
  T extends "reference"  ? "Reference" :
  T extends "quantity"   ? "Quantity"  :
                           never;

export type PolyKeyFor<
  Base extends string,
  T extends AnswerableQuestionType,
> = `${Base}${KeySuffixFor<T>}`;

export type PolyCarrierFor<
  Base extends string,
  T extends AnswerableQuestionType,
> = { [K in PolyKeyFor<Base, T>]?: unknown };

// prettier-ignore
const SUFFIX_BY_TYPE: { [K in AnswerableQuestionType]: KeySuffixFor<K> } = {
  boolean:    "Boolean",
  decimal:    "Decimal",
  integer:    "Integer",
  date:       "Date",
  dateTime:   "DateTime",
  time:       "Time",
  string:     "String",
  text:       "String",
  url:        "Uri",
  coding:     "Coding",
  attachment: "Attachment",
  reference:  "Reference",
  quantity:   "Quantity",
} as const;

export function getPolymorphic<
  Base extends string,
  T extends AnswerableQuestionType,
>(
  obj: PolyCarrierFor<Base, T> | null | undefined,
  base: Base,
  type: T,
): AnswerValueFor<T> | undefined {
  if (!obj) return undefined;

  // Build the key at runtime, e.g., "valueString" | "answerUri" | "fooQuantity"
  const suffix = SUFFIX_BY_TYPE[type];
  const key = `${base}${suffix}` satisfies PolyKeyFor<Base, T>;

  return (obj as Record<string, unknown>)[key] as AnswerValueFor<T> | undefined;
}

export const getValue = <T extends AnswerableQuestionType>(
  obj: PolyCarrierFor<"value", T> | null | undefined,
  type: T,
): AnswerValueFor<T> | undefined => getPolymorphic(obj, "value", type);

export const getAnswer = <T extends AnswerableQuestionType>(
  obj: PolyCarrierFor<"answer", T> | null | undefined,
  type: T,
): AnswerValueFor<T> | undefined => getPolymorphic(obj, "answer", type);

export function isCoding(value: unknown): value is Coding {
  return (
    typeof value === "object" && value !== null && "code" in (value as Coding)
  );
}

export function isReference(value: unknown): value is Reference {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const reference = value as Reference;
  return (
    reference.reference != null ||
    reference.identifier != null ||
    reference.type != null ||
    reference.display != null
  );
}

export function isAttachment(value: unknown): value is Attachment {
  return typeof value === "object" && value !== null;
}

export function areCodingsEqual(actual: unknown, expected: unknown) {
  const a = actual as Coding | undefined;
  const b = expected as Coding | undefined;
  if (!a || !b) {
    return false;
  }

  return (
    (a.system ?? null) === (b.system ?? null) &&
    (a.version ?? null) === (b.version ?? null) &&
    (a.code ?? null) === (b.code ?? null) &&
    (a.display ?? null) === (b.display ?? null)
  );
}

export function areQuantitiesEqual(actual: unknown, expected: unknown) {
  const a = actual as Quantity | undefined;
  const b = expected as Quantity | undefined;
  if (!a || !b) {
    return false;
  }

  return (
    (a.value ?? null) === (b.value ?? null) &&
    (a.unit ?? null) === (b.unit ?? null) &&
    (a.system ?? null) === (b.system ?? null) &&
    (a.code ?? null) === (b.code ?? null) &&
    (a.comparator ?? null) === (b.comparator ?? null)
  );
}

export function areReferencesEqual(actual: unknown, expected: unknown) {
  const a = actual as Reference | undefined;
  const b = expected as Reference | undefined;
  if (!a || !b) {
    return false;
  }

  return (
    (a.reference ?? null) === (b.reference ?? null) &&
    (a.type ?? null) === (b.type ?? null) &&
    (a.identifier?.system ?? null) === (b.identifier?.system ?? null) &&
    (a.identifier?.value ?? null) === (b.identifier?.value ?? null)
  );
}

export function areAttachmentsEqual(actual: Attachment, expected: Attachment) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function fhirDateToMillis(value: unknown): number | undefined {
  if (typeof value != "string") return undefined;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function fhirDateTimeToMillis(value: unknown): number | undefined {
  if (typeof value != "string") return undefined;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function fhirTimeToMillis(value: unknown): number | undefined {
  if (typeof value != "string") return undefined;
  const match = /^(\d{2})(?::(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(
    value,
  );
  if (!match) {
    return undefined;
  }

  const hours = Number.parseInt(match[1] ?? "", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const seconds = Number.parseInt(match[3] ?? "0", 10);
  const millis = Number.parseInt((match[4] ?? "0").padEnd(3, "0"), 10);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    Number.isNaN(millis)
  ) {
    return undefined;
  }

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return undefined;
  }

  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

export function compareQuantities(
  value: Quantity,
  expected: Quantity,
): number | undefined {
  if (
    (value.system ?? null) !== (expected.system ?? null) ||
    (value.code ?? null) !== (expected.code ?? null) ||
    (value.unit ?? null) !== (expected.unit ?? null) ||
    (value.comparator ?? null) !== (expected.comparator ?? null)
  ) {
    return undefined;
  }

  if (typeof value.value !== "number" || typeof expected.value !== "number") {
    return undefined;
  }

  return value.value - expected.value;
}

export function compareNumbers(
  actual: unknown,
  expected: unknown,
): number | undefined {
  return typeof actual !== "number" || typeof expected !== "number"
    ? undefined
    : actual - expected;
}

export function evaluateEnableWhenCondition(
  condition: QuestionnaireItemEnableWhen,
  question: IQuestionStore,
): boolean {
  const answers = question.answers.filter(answerHasOwnValue);
  const operator = condition.operator;

  switch (operator) {
    case "exists": {
      const expected = condition.answerBoolean;
      if (typeof expected !== "boolean") {
        return false;
      }
      return expected ? answers.length > 0 : answers.length === 0;
    }

    case "=": {
      const expected = getAnswer(condition, question.type);
      if (expected === undefined) {
        return false;
      }

      for (const answer of answers) {
        const actual = answer.value;
        if (actual == null) continue;
        if (valuesEqual(actual, expected, question.type)) {
          return true;
        }
      }
      return false;
    }

    case "!=": {
      const expected = getAnswer(condition, question.type);
      if (expected === undefined) {
        return false;
      }

      let comparable = false;
      for (const answer of answers) {
        const actual = answer.value;
        if (actual == null) continue;
        comparable = true;
        if (valuesEqual(actual, expected, question.type)) {
          return false;
        }
      }
      return comparable;
    }

    case ">":
    case ">=":
    case "<":
    case "<=": {
      const expected = getAnswer(condition, question.type);
      if (expected === undefined) return false;

      switch (question.type) {
        case "decimal":
        case "integer":
        case "date":
        case "dateTime":
        case "time":
        case "string":
        case "text":
        case "url":
        case "quantity": {
          for (const answer of answers) {
            const actual = answer.value;
            if (actual == null) continue;
            const diff = compareValues(actual, expected, question.type);
            if (diff === undefined) continue;
            if (
              (operator === ">" && diff > 0) ||
              (operator === ">=" && diff >= 0) ||
              (operator === "<" && diff < 0) ||
              (operator === "<=" && diff <= 0)
            ) {
              return true;
            }
          }
          return false;
        }
        case "boolean":
        case "coding":
        case "reference":
        case "attachment":
        default:
          return false;
      }
    }

    default:
      return false;
  }
}

function valuesEqual(
  actual: unknown,
  expected: unknown,
  type: AnswerableQuestionType,
) {
  switch (type) {
    case "decimal":
    case "integer":
    case "date":
    case "dateTime":
    case "time":
    case "string":
    case "text":
    case "url":
    case "boolean":
      return actual === expected;
    case "coding":
      return isCoding(actual) && isCoding(expected)
        ? areCodingsEqual(actual, expected)
        : false;
    case "quantity":
      return isQuantity(actual) && isQuantity(expected)
        ? areQuantitiesEqual(actual, expected)
        : false;
    case "reference":
      return isReference(actual) && isReference(expected)
        ? areReferencesEqual(actual, expected)
        : false;
    case "attachment":
      return isAttachment(actual) && isAttachment(expected)
        ? areAttachmentsEqual(actual, expected)
        : false;
    default:
      return actual === expected;
  }
}

function compareValues(
  actual: unknown,
  expected: unknown,
  type: AnswerableQuestionType,
): number | undefined {
  switch (type) {
    case "decimal":
    case "integer":
      return compareNumbers(actual, expected);
    case "date":
      return compareNumbers(
        fhirDateToMillis(actual),
        fhirDateToMillis(expected),
      );
    case "dateTime":
      return compareNumbers(
        fhirDateTimeToMillis(actual),
        fhirDateTimeToMillis(expected),
      );
    case "time":
      return compareNumbers(
        fhirTimeToMillis(actual),
        fhirTimeToMillis(expected),
      );
    case "string":
    case "text":
    case "url":
      return typeof actual !== "string" || typeof expected !== "string"
        ? undefined
        : actual.localeCompare(expected);
    case "quantity":
      return !isQuantity(actual) || !isQuantity(expected)
        ? undefined
        : compareQuantities(actual, expected);
    case "coding":
    case "reference":
    case "attachment":
    case "boolean":
    default:
      return undefined;
  }
}
