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
import {
  Attachment,
  Element,
  Extension,
  type OperationOutcomeIssue,
  Quantity,
  QuestionnaireItem,
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

function isQuantity(value: unknown): value is Quantity {
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

export function answerHasValue<T extends AnswerableQuestionType>(
  answer: IAnswerInstance<AnswerValueFor<T>>,
): boolean {
  if (answer.children.some((child) => child.responseItems.length > 0)) {
    return true;
  }

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
