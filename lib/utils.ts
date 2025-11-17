import {
  AnswerType,
  AnswerTypeToDataType,
  DataType,
  DataTypeToSuffix,
  DataTypeToType,
  IAnswerInstance,
  IPresentableNode,
  IQuestionNode,
  IRepeatingGroupNode,
  OperationOutcomeIssueCode,
} from "./stores/types.ts";
import {
  Attachment,
  Coding,
  Element,
  Extension,
  OperationOutcomeIssue,
  Quantity,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponseItem,
  Reference,
} from "fhir/r5";
import r5 from "fhirpath/fhir-context/r5";
import { UcumLhcUtils } from "@lhncbc/ucum-lhc";

export function sanitizeForId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function getItemLabelId(item: IPresentableNode): string {
  return sanitizeForId(`af-${item.key}-label`);
}

export function getItemHelpId(item: IPresentableNode): string {
  return sanitizeForId(`af-${item.key}-help`);
}

export function getItemErrorId(item: IPresentableNode): string {
  return sanitizeForId(`af-${item.key}-errors`);
}

export function getAnswerErrorId(answer: IAnswerInstance<unknown>): string {
  return sanitizeForId(`af-${answer.key}-errors`);
}

export function dedupe<T>(values: readonly T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  });
  return result;
}

export function hasHttpStatus(error: unknown): error is { status: number } {
  return typeof (error as { status?: unknown }).status === "number";
}

// prettier-ignore
export const EXT = {
  MIN_OCCURS:                    "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  MAX_OCCURS:                    "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  MIN_VALUE:                     "http://hl7.org/fhir/StructureDefinition/minValue",
  MAX_VALUE:                     "http://hl7.org/fhir/StructureDefinition/maxValue",
  MIN_LENGTH:                    "http://hl7.org/fhir/StructureDefinition/minLength",
  MAX_DECIMAL_PLACES:            "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces",
  MIME_TYPE:                     "http://hl7.org/fhir/StructureDefinition/mimeType",
  MAX_SIZE:                      "http://hl7.org/fhir/StructureDefinition/maxSize",
  SDC_MIN_QUANTITY:              "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity",
  SDC_MAX_QUANTITY:              "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity",
  HIDDEN:                        "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
  ITEM_CONTROL:                  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
  QUESTIONNAIRE_UNIT:            "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
  QUESTIONNAIRE_UNIT_OPTION:     "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
  SDC_ENABLE_WHEN_EXPR:          "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression",
  SDC_CALCULATED_EXPR:           "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
  SDC_INITIAL_EXPR:              "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
  SDC_ANSWER_EXPR:               "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression",
  SDC_ANSWER_OPTIONS_TOGGLE:     "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerOptionsToggleExpression",
  SDC_VARIABLE:                  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-variable",
  SDC_KEYBOARD:                  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-keyboard",
  CQF_EXPRESSION:                "http://hl7.org/fhir/StructureDefinition/cqf-expression",
  CQF_CALCULATED_VALUE:          "http://hl7.org/fhir/uv/cql/StructureDefinition/cqf-calculatedValue",
  TARGET_CONSTRAINT:             "http://hl7.org/fhir/StructureDefinition/targetConstraint",
  PREFERRED_TERMINOLOGY_SERVER:  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-preferredTerminologyServer",
} as const;

export function answerify<T extends AnswerType>(
  answerType: T,
  raw: unknown,
): QuestionnaireItemAnswerOption[] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[answerType];
  const options: QuestionnaireItemAnswerOption[] = [];
  const normalize = (value: unknown) => {
    switch (answerType) {
      case "boolean":
        if (typeof value === "boolean") {
          return value as DataTypeToType<AnswerTypeToDataType<T>>;
        }
        if (typeof value === "string") {
          if (/^true$/i.test(value)) {
            return true as DataTypeToType<AnswerTypeToDataType<T>>;
          }
          if (/^false$/i.test(value)) {
            return false as DataTypeToType<AnswerTypeToDataType<T>>;
          }
        }
        return undefined;
      case "decimal":
      case "integer": {
        const numberValue = parseNumber(value);
        return numberValue === undefined
          ? undefined
          : (numberValue as DataTypeToType<AnswerTypeToDataType<T>>);
      }
      case "date":
      case "dateTime":
      case "time":
      case "string":
      case "text":
      case "url":
        if (typeof value === "string") {
          return value as DataTypeToType<AnswerTypeToDataType<T>>;
        }
        return undefined;
      case "coding":
        return isCoding(value)
          ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
          : undefined;
      case "quantity":
        return isQuantity(value)
          ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
          : undefined;
      case "reference":
        return isReference(value)
          ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
          : undefined;
      case "attachment":
        return isAttachment(value)
          ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
          : undefined;
      default:
        return undefined;
    }
  };

  const append = (entry: unknown) => {
    if (entry == null) return;

    if (Array.isArray(entry)) {
      entry.forEach(append);
      return;
    }

    if (entry && typeof entry === "object") {
      const optionValue = getValue(
        entry as QuestionnaireItemAnswerOption,
        dataType,
      );

      if (optionValue !== undefined) {
        const normalized = normalize(optionValue);
        if (normalized === undefined) {
          return;
        }

        options.push({
          ...(entry as QuestionnaireItemAnswerOption),
          ...asAnswerFragment(dataType, normalized),
        });
        return;
      }
    }

    const normalized = normalize(entry);
    if (normalized === undefined) {
      return;
    }

    options.push(asAnswerFragment(dataType, normalized));
  };

  append(raw);

  return options;
}

export function findExtension(
  element: Element,
  url: string,
): Extension | undefined {
  return element.extension?.find((e) => e.url === url);
}

export function findExtensions(element: Element, url: string): Extension[] {
  return element.extension?.filter((e) => e.url === url) ?? [];
}

export const ITEM_CONTROL_CODES = [
  "group",
  "list",
  "table",
  "htable",
  "gtable",
  "atable",
  "header",
  "footer",
  "text",
  "inline",
  "prompt",
  "unit",
  "lower",
  "upper",
  "flyover",
  "help",
  "question",
  "autocomplete",
  "drop-down",
  "check-box",
  "lookup",
  "radio-button",
  "slider",
  "spinner",
  "text-box",
] as const;

export type QuestionnaireItemControlCode = (typeof ITEM_CONTROL_CODES)[number];

export const ITEM_CONTROL_SYSTEM =
  "http://hl7.org/fhir/questionnaire-item-control";

export function shouldCreateStore(item: QuestionnaireItem): boolean {
  if (item.type !== "display") {
    return true;
  }

  const control = getItemControl(item);
  return control !== "help" && control !== "unit";
}

export function isEmptyObject(value: unknown): boolean {
  if (value == null || typeof value !== "object") {
    return true;
  }

  return !Object.values(value as Record<string, unknown>).some((entry) => {
    if (entry == null) {
      return false;
    }
    if (Array.isArray(entry)) {
      return entry.length > 0;
    }
    if (typeof entry === "object") {
      return !isEmptyObject(entry);
    }
    return true;
  });
}

export function getItemControl(
  item: QuestionnaireItem,
  system: string = ITEM_CONTROL_SYSTEM,
): QuestionnaireItemControlCode | undefined {
  for (const extension of item.extension ?? []) {
    if (extension.url !== EXT.ITEM_CONTROL) {
      continue;
    }

    const coding = extension.valueCodeableConcept?.coding?.[0];
    if (!coding) {
      continue;
    }

    if (coding.system && coding.system !== system) {
      continue;
    }

    if (coding.code) {
      return coding.code as QuestionnaireItemControlCode;
    }
  }

  return undefined;
}

export function isQuantity(value: unknown): value is Quantity {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const quantity = value as Quantity;
  return (
    "value" in quantity ||
    "unit" in quantity ||
    "code" in quantity ||
    "system" in quantity ||
    "comparator" in quantity
  );
}

export function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

function parseQuantityString(value: string): Quantity | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const match = trimmed.match(
    /^([+-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][+-]?\d+)?)\s*(.*)$/,
  );
  if (!match) {
    return undefined;
  }

  const numericPortion = parseNumber(match[1]);
  if (numericPortion === undefined) {
    return undefined;
  }

  const unitPortion = match[2]?.trim() ?? "";
  if (unitPortion.length === 0) {
    return { value: numericPortion };
  }

  const normalizedUnit =
    unitPortion.length >= 2 &&
    ((unitPortion.startsWith("'") && unitPortion.endsWith("'")) ||
      (unitPortion.startsWith('"') && unitPortion.endsWith('"')))
      ? unitPortion.slice(1, -1)
      : unitPortion;

  return normalizedUnit.length > 0
    ? {
        value: numericPortion,
        unit: normalizedUnit,
        code: normalizedUnit,
        system: "http://unitsofmeasure.org",
      }
    : { value: numericPortion };
}

export function countDecimalPlaces(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const asString = value.toString();
  if (!asString.includes("e") && asString.includes(".")) {
    return asString.split(".")[1]?.length ?? 0;
  }

  const [base, exponentPart] = asString.split("e");
  const exponent = Number(exponentPart);
  if (Number.isNaN(exponent)) {
    return 0;
  }

  const fractional = base.includes(".") ? (base.split(".")[1]?.length ?? 0) : 0;
  return Math.max(0, fractional - exponent);
}

export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: ReadonlyArray<K>,
): Omit<T, K> {
  const result = { ...source };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

export function estimateAttachmentSize(
  attachment: Attachment,
): number | undefined {
  if (typeof attachment.size === "number") {
    return attachment.size;
  }

  if (typeof attachment.size === "string") {
    const parsed = Number(attachment.size);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (typeof attachment.data === "string") {
    const length = attachment.data.length;
    if (length === 0) {
      return 0;
    }

    const padding = attachment.data.endsWith("==")
      ? 2
      : attachment.data.endsWith("=")
        ? 1
        : 0;
    return Math.floor((length * 3) / 4) - padding;
  }

  return undefined;
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

export function instanceHasResponses(instance: IRepeatingGroupNode): boolean {
  return instance.nodes.some((child) => child.responseItems.length > 0);
}

export function makeIssue(
  code: OperationOutcomeIssueCode,
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

export function answerHasContent<T extends AnswerType>(
  answer: IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>,
): boolean {
  if (answer.nodes.some((child) => child.responseItems.length > 0)) {
    return true;
  }

  return answerHasOwnValue(answer);
}

export function getItemDescribedBy<T extends AnswerType>(
  item: IQuestionNode<T>,
) {
  const describedByPieces = [
    item.help ? getItemHelpId(item) : undefined,
    item.hasErrors ? getItemErrorId(item) : undefined,
  ].filter(Boolean) as string[];
  return describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;
}

export type PolyKeyFor<
  Base extends string,
  T extends DataType,
> = `${Base}${DataTypeToSuffix<T>}`;

export type PolyCarrierFor<Base extends string, T extends DataType> = {
  [K in PolyKeyFor<Base, T>]?: unknown;
};

export const ANSWER_TYPE_TO_DATA_TYPE: Record<AnswerType, DataType> = {
  boolean: "boolean",
  decimal: "decimal",
  integer: "integer",
  date: "date",
  dateTime: "dateTime",
  time: "time",
  string: "string",
  text: "string",
  url: "uri",
  coding: "Coding",
  attachment: "Attachment",
  reference: "Reference",
  quantity: "Quantity",
};

// prettier-ignore
export const DATA_TYPE_TO_SUFFIX: { [K in DataType]: DataTypeToSuffix<K> } = {
  "base64Binary": "Base64Binary",
  "boolean": "Boolean",
  "canonical": "Canonical",
  "code": "Code",
  "date": "Date",
  "dateTime": "DateTime",
  "decimal": "Decimal",
  "id": "Id",
  "instant": "Instant",
  "integer": "Integer",
  "integer64": "Integer64",
  "markdown": "Markdown",
  "oid": "Oid",
  "positiveInt": "PositiveInt",
  "string": "String",
  "time": "Time",
  "unsignedInt": "UnsignedInt",
  "uri": "Uri",
  "url": "Url",
  "uuid": "Uuid",
  "Address": "Address",
  "Age": "Age",
  "Annotation": "Annotation",
  "Attachment": "Attachment",
  "CodeableConcept": "CodeableConcept",
  "CodeableReference": "CodeableReference",
  "Coding": "Coding",
  "ContactPoint": "ContactPoint",
  "Count": "Count",
  "Distance": "Distance",
  "Duration": "Duration",
  "HumanName": "HumanName",
  "Identifier": "Identifier",
  "Money": "Money",
  "Period": "Period",
  "Quantity": "Quantity",
  "Range": "Range",
  "Ratio": "Ratio",
  "RatioRange": "RatioRange",
  "Reference": "Reference",
  "SampledData": "SampledData",
  "Signature": "Signature",
  "Timing": "Timing",
  "ContactDetail": "ContactDetail",
  "DataRequirement": "DataRequirement",
  "Expression": "Expression",
  "ParameterDefinition": "ParameterDefinition",
  "RelatedArtifact": "RelatedArtifact",
  "TriggerDefinition": "TriggerDefinition",
  "UsageContext": "UsageContext",
  "Availability": "Availability",
  "ExtendedContactDetail": "ExtendedContactDetail",
  "Dosage": "Dosage",
  "Meta": "Meta",
} as const;

export function getPolymorphic<Base extends string, T extends DataType>(
  obj: PolyCarrierFor<Base, T> | null | undefined,
  base: Base,
  type: T,
): DataTypeToType<T> | undefined {
  if (!obj) return undefined;

  // Build the key at runtime, e.g., "valueString" | "answerUri" | "fooQuantity"
  const suffix = DATA_TYPE_TO_SUFFIX[type];
  const key = `${base}${suffix}` satisfies PolyKeyFor<Base, T>;

  return (obj as Record<string, unknown>)[key] as DataTypeToType<T> | undefined;
}

export const getValue = <T extends DataType>(
  obj: PolyCarrierFor<"value", T> | null | undefined,
  type: T,
): DataTypeToType<T> | undefined => getPolymorphic(obj, "value", type);

export const getAnswer = <T extends DataType>(
  obj: PolyCarrierFor<"answer", T> | null | undefined,
  type: T,
): DataTypeToType<T> | undefined => getPolymorphic(obj, "answer", type);

export function extractExtensionValue<T extends DataType>(
  element: Pick<Element, "extension"> | undefined,
  url: string,
  type: T,
): DataTypeToType<T> | undefined {
  const extension = element && findExtension(element, url);
  return extension ? getValue(extension, type) : undefined;
}

export function extractExtensionValueElement<T extends DataType>(
  element: Pick<Element, "extension">,
  url: string,
  type: T,
): Element | undefined {
  const extension = findExtension(element, url);
  const key = `_value${DATA_TYPE_TO_SUFFIX[type]}` as keyof Extension;
  return extension?.[key] as Element;
}

export function extractExtensionsValues<T extends DataType>(
  element: Pick<Element, "extension">,
  url: string,
  type: T,
): DataTypeToType<T>[] {
  const extensions = findExtensions(element, url);
  return extensions
    .map((extension) => getValue(extension, type))
    .filter((value): value is DataTypeToType<T> => value != null);
}

type ValueKeyFor<T extends DataType> = PolyKeyFor<"value", T>;
type ValueCarrierFor<T extends DataType> = PolyCarrierFor<"value", T>;

export function asAnswerFragment<T extends DataType>(
  type: T,
  value: DataTypeToType<T>,
): ValueCarrierFor<T> {
  const key = `value${DATA_TYPE_TO_SUFFIX[type]}` as ValueKeyFor<T>;
  return {
    [key]: value,
  } as ValueCarrierFor<T>;
}

export function isCoding(value: unknown): value is Coding {
  return (
    typeof value === "object" &&
    value !== null &&
    ("code" in (value as Coding) ||
      "display" in (value as Coding) ||
      "system" in (value as Coding))
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
  if (!isCoding(actual) || !isCoding(expected)) {
    return false;
  }

  const aCode = actual.code ?? null;
  const bCode = expected.code ?? null;
  const aSystem = actual.system ?? null;
  const bSystem = expected.system ?? null;

  if (aCode != null && bCode != null) {
    return aCode === bCode && aSystem === bSystem;
  }

  const aDisplay = actual.display ?? null;
  const bDisplay = expected.display ?? null;
  if (aDisplay != null && bDisplay != null) {
    return aDisplay === bDisplay && aSystem === bSystem;
  }

  return false;
}

export function areQuantitiesEqual(actual: unknown, expected: unknown) {
  if (!isQuantity(actual) || !isQuantity(expected)) {
    return false;
  }

  if ((actual.comparator ?? null) !== (expected.comparator ?? null)) {
    return false;
  }

  const actualValue =
    typeof actual.value === "number" ? actual.value : undefined;
  const expectedValue =
    typeof expected.value === "number" ? expected.value : undefined;

  if (actualValue === undefined || expectedValue === undefined) {
    return (
      (actual.value ?? null) === (expected.value ?? null) &&
      (actual.unit ?? null) === (expected.unit ?? null) &&
      (actual.system ?? null) === (expected.system ?? null) &&
      (actual.code ?? null) === (expected.code ?? null)
    );
  }

  if (haveSameQuantityIdentity(actual, expected)) {
    return actualValue === expectedValue;
  }

  if (isConvertibleQuantity(actual) && isConvertibleQuantity(expected)) {
    const targetCode = getUcumUnitCode(expected);
    if (targetCode) {
      const normalizedActual = convertQuantityValue(actual, targetCode);
      if (typeof normalizedActual === "number") {
        return normalizedActual === expectedValue;
      }
    }

    const fallbackTarget = getUcumUnitCode(actual);
    if (fallbackTarget) {
      const normalizedExpected = convertQuantityValue(expected, fallbackTarget);
      if (typeof normalizedExpected === "number") {
        return normalizedExpected === actualValue;
      }
    }
  }

  return false;
}

export function areReferencesEqual(actual: unknown, expected: unknown) {
  if (!isReference(actual) || !isReference(expected)) {
    return false;
  }

  return (
    (actual.reference ?? null) === (expected.reference ?? null) &&
    (actual.type ?? null) === (expected.type ?? null) &&
    (actual.identifier?.system ?? null) ===
      (expected.identifier?.system ?? null) &&
    (actual.identifier?.value ?? null) === (expected.identifier?.value ?? null)
  );
}

export function areAttachmentsEqual(actual: unknown, expected: unknown) {
  if (!isAttachment(actual) || !isAttachment(expected)) {
    return false;
  }

  return JSON.stringify(actual) === JSON.stringify(expected);
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

const TIME_SHORT_FORMATTERS: Record<TimePrecision, Intl.DateTimeFormat> = {
  hour: new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  }),
  minute: new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }),
  second: new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }),
  millisecond: new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }),
};

type DatePrecision = "year" | "month" | "day";

export function getDatePrecision(value: string): DatePrecision | null {
  if (/^\d{4}$/.test(value)) return "year";
  if (/^\d{4}-\d{2}$/.test(value)) return "month";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "day";
  return null;
}

export function areFhirDatesEqual(a: string, b: string): boolean {
  const precisionA = getDatePrecision(a);
  const precisionB = getDatePrecision(b);
  if (!precisionA || !precisionB || precisionA !== precisionB) {
    return false;
  }
  return a === b;
}

export function areDateValuesEqual(a: unknown, b: unknown): boolean {
  return (
    typeof a === "string" && typeof b === "string" && areFhirDatesEqual(a, b)
  );
}

export function formatDateForDisplay(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value);
  if (!match) {
    return null;
  }

  const year = match[1];
  const month = match[2] ?? "01";
  const day = match[3] ?? "01";
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (!match[2]) {
    return year;
  }

  if (!match[3]) {
    return MONTH_YEAR_FORMATTER.format(date);
  }

  return DATE_FORMATTER.format(date);
}

type DateTimePrecision =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

type ParsedFhirDateTime = {
  precision: DateTimePrecision;
  hasTime: boolean;
  hasTimezone: boolean;
  epochMillis?: number;
};

export function parseFhirDateTime(value: string): ParsedFhirDateTime | null {
  const [datePart, timeAndZone] = value.split("T");
  if (!datePart) {
    return null;
  }

  const datePrecision = getDatePrecision(datePart);
  if (!datePrecision) {
    return null;
  }

  if (timeAndZone === undefined) {
    return {
      precision: datePrecision,
      hasTime: false,
      hasTimezone: false,
    };
  }

  const timezoneMatch = /(Z|[+-]\d{2}:\d{2})$/.exec(timeAndZone);
  const timezone = timezoneMatch?.[1];
  const timePart = timezone
    ? timeAndZone.slice(0, -timezone.length)
    : timeAndZone;

  if (timePart.length === 0) {
    return null;
  }

  const timeInfo = parseFhirTime(timePart);
  if (!timeInfo) {
    return null;
  }

  const precisionMap: Record<TimePrecision, DateTimePrecision> = {
    hour: "hour",
    minute: "minute",
    second: "second",
    millisecond: "millisecond",
  };

  const precision = precisionMap[timeInfo.precision];
  const hasTimezone = Boolean(timezone);
  let epochMillis: number | undefined;

  if (hasTimezone) {
    const parsed = Date.parse(`${datePart}T${timePart}${timezone}`);
    if (!Number.isNaN(parsed)) {
      epochMillis = parsed;
    }
  }

  const result: ParsedFhirDateTime = {
    precision,
    hasTime: true,
    hasTimezone,
  };

  if (epochMillis !== undefined) {
    result.epochMillis = epochMillis;
  }

  return result;
}

export function areFhirDateTimesEqual(a: string, b: string): boolean {
  const parsedA = parseFhirDateTime(a);
  const parsedB = parseFhirDateTime(b);
  if (!parsedA || !parsedB) {
    return false;
  }

  if (
    parsedA.precision !== parsedB.precision ||
    parsedA.hasTime !== parsedB.hasTime
  ) {
    return false;
  }

  const zonePattern = /(Z|[+-]\d{2}:\d{2})$/;
  const hasZoneA = zonePattern.test(a);
  const hasZoneB = zonePattern.test(b);
  if (hasZoneA !== hasZoneB) {
    return false;
  }

  if (hasZoneA && hasZoneB) {
    const epochA = Date.parse(a);
    const epochB = Date.parse(b);
    if (!Number.isNaN(epochA) && !Number.isNaN(epochB)) {
      return epochA === epochB;
    }
  }

  return a === b;
}

export function formatDateTimeForDisplay(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = parseFhirDateTime(value);
  if (!parsed) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (!parsed.hasTime) {
    return DATE_FORMATTER.format(date);
  }

  return DATE_TIME_FORMATTER.format(date);
}

export function areDateTimeValuesEqual(a: unknown, b: unknown): boolean {
  return (
    typeof a === "string" &&
    typeof b === "string" &&
    areFhirDateTimesEqual(a, b)
  );
}

type TimePrecision = "hour" | "minute" | "second" | "millisecond";

export function parseFhirTime(value: string): {
  precision: TimePrecision;
  millis: number;
} | null {
  const match = /^(\d{2})(?::(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(
    value,
  );
  if (!match) {
    return null;
  }

  const [, , minute, second, fractional] = match;

  let precision: TimePrecision;
  if (!minute) precision = "hour";
  else if (!second) precision = "minute";
  else if (!fractional) precision = "second";
  else precision = "millisecond";

  const millis = fhirTimeToMillis(value);
  if (millis == null) {
    return null;
  }

  return { precision, millis };
}

export function areFhirTimesEqual(a: string, b: string): boolean {
  const parsedA = parseFhirTime(a);
  const parsedB = parseFhirTime(b);
  if (!parsedA || !parsedB) {
    return false;
  }

  if (parsedA.precision !== parsedB.precision) {
    return false;
  }

  return parsedA.millis === parsedB.millis;
}

export function areTimeValuesEqual(a: unknown, b: unknown): boolean {
  return (
    typeof a === "string" && typeof b === "string" && areFhirTimesEqual(a, b)
  );
}

export function formatTimeValue(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const info = parseFhirTime(value);
  if (!info) {
    return null;
  }

  const [hours = "00", minutes = "00", seconds = "00"] = value
    .split(":")
    .concat(["00", "00"]);
  const hoursInt = Number.parseInt(hours, 10) || 0;
  const minutesInt = Number.parseInt(minutes, 10) || 0;
  const secondsInt = Number.parseInt(seconds, 10) || 0;
  const date = new Date(1970, 0, 1, hoursInt, minutesInt, secondsInt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return TIME_SHORT_FORMATTERS[info.precision].format(date);
}

export function compareDateValues(
  actual: unknown,
  expected: unknown,
): number | undefined {
  if (typeof actual !== "string" || typeof expected !== "string") {
    return undefined;
  }
  const precisionA = getDatePrecision(actual);
  const precisionB = getDatePrecision(expected);
  if (!precisionA || !precisionB || precisionA !== precisionB) {
    return undefined;
  }
  if (precisionA !== "day") {
    return areFhirDatesEqual(actual, expected) ? 0 : undefined;
  }
  return compareNumbers(Date.parse(actual), Date.parse(expected));
}

export function compareDateTimeValues(
  actual: unknown,
  expected: unknown,
): number | undefined {
  if (typeof actual !== "string" || typeof expected !== "string") {
    return undefined;
  }
  const parsedA = parseFhirDateTime(actual);
  const parsedB = parseFhirDateTime(expected);
  if (!parsedA || !parsedB) {
    return undefined;
  }
  if (
    parsedA.precision !== parsedB.precision ||
    parsedA.hasTime !== parsedB.hasTime ||
    parsedA.hasTimezone !== parsedB.hasTimezone
  ) {
    return undefined;
  }
  if (!parsedA.hasTime) {
    return areFhirDateTimesEqual(actual, expected) ? 0 : undefined;
  }
  if (
    parsedA.hasTimezone &&
    parsedA.epochMillis != null &&
    parsedB.epochMillis != null
  ) {
    return parsedA.epochMillis - parsedB.epochMillis;
  }
  if (parsedA.hasTimezone && parsedB.hasTimezone) {
    const epochA = Date.parse(actual);
    const epochB = Date.parse(expected);
    if (!Number.isNaN(epochA) && !Number.isNaN(epochB)) {
      return epochA - epochB;
    }
  }
  return undefined;
}

export function compareTimeValues(
  actual: unknown,
  expected: unknown,
): number | undefined {
  if (typeof actual !== "string" || typeof expected !== "string") {
    return undefined;
  }
  const timeA = parseFhirTime(actual);
  const timeB = parseFhirTime(expected);
  if (!timeA || !timeB || timeA.precision !== timeB.precision) {
    return undefined;
  }
  return timeA.millis - timeB.millis;
}

export function compareStringValues(
  actual: unknown,
  expected: unknown,
): number | undefined {
  return typeof actual !== "string" || typeof expected !== "string"
    ? undefined
    : actual.localeCompare(expected);
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

const UCUM_SYSTEM_URI = "http://unitsofmeasure.org";

let ucumUtilsInstance: UcumLhcUtils | undefined;

function getUcumUtils(): UcumLhcUtils {
  if (!ucumUtilsInstance) {
    ucumUtilsInstance = new UcumLhcUtils();
  }
  return ucumUtilsInstance;
}

function isUcumSystem(system: string | null | undefined): boolean {
  return system == null || system === UCUM_SYSTEM_URI;
}

function getUcumUnitCode(quantity: Quantity): string | undefined {
  const raw = quantity.code ?? quantity.unit;
  if (typeof raw !== "string") {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function isConvertibleQuantity(quantity: Quantity): boolean {
  return (
    isUcumSystem(quantity.system ?? undefined) &&
    getUcumUnitCode(quantity) !== undefined
  );
}

function convertQuantityValue(
  quantity: Quantity,
  targetCode: string,
): number | undefined {
  if (typeof quantity.value !== "number") {
    return undefined;
  }

  const sourceCode = getUcumUnitCode(quantity);
  if (!sourceCode) {
    return undefined;
  }

  try {
    const result = getUcumUtils().convertUnitTo(
      sourceCode,
      quantity.value,
      targetCode,
    );
    if (result.status === "succeeded" && typeof result.toVal === "number") {
      return result.toVal;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function haveSameQuantityIdentity(a: Quantity, b: Quantity): boolean {
  return (
    (a.system ?? null) === (b.system ?? null) &&
    (a.code ?? null) === (b.code ?? null) &&
    (a.unit ?? null) === (b.unit ?? null)
  );
}

export function compareQuantities(
  value: unknown,
  expected: unknown,
): number | undefined {
  if (!isQuantity(value) || !isQuantity(expected)) {
    return undefined;
  }

  if ((value.comparator ?? null) !== (expected.comparator ?? null)) {
    return undefined;
  }

  if (typeof value.value !== "number" || typeof expected.value !== "number") {
    return undefined;
  }

  if (haveSameQuantityIdentity(value, expected)) {
    return value.value - expected.value;
  }

  if (isConvertibleQuantity(value) && isConvertibleQuantity(expected)) {
    const targetCode = getUcumUnitCode(expected);
    if (targetCode) {
      const normalizedActual = convertQuantityValue(value, targetCode);
      if (typeof normalizedActual === "number") {
        return normalizedActual - expected.value;
      }
    }
  }

  return undefined;
}

export function compareNumbers(
  actual: unknown,
  expected: unknown,
): number | undefined {
  return typeof actual !== "number" || typeof expected !== "number"
    ? undefined
    : actual - expected;
}

export function isAncestorOf(
  ancestor: IPresentableNode,
  candidate: IPresentableNode,
): boolean {
  let parent = candidate.parentStore;
  while (parent) {
    if (parent === ancestor) return true;
    parent = parent.parentStore;
  }
  return false;
}

export function evaluateEnableWhenCondition(
  self: IPresentableNode,
  condition: QuestionnaireItemEnableWhen,
  question: IQuestionNode,
): boolean {
  if (
    isAncestorOf(self, question) || // if the question is a *descendant*, we must treat it as not valued (otherwise that would recurse).
    !question.isEnabled // if the dependency exists but is currently disabled, also treat as not valued.
  ) {
    return condition.operator === "exists"
      ? condition.answerBoolean === false // When nothing is valued, only "exists = false" is true.
      : false; // All other operators cannot match without any answers
  }
  const answers = question.repeats
    ? question.answers
    : question.answers.slice(0, 1);
  const populatedAnswers = answers.filter(answerHasOwnValue);
  const operator = condition.operator;

  switch (operator) {
    case "exists": {
      const expected = condition.answerBoolean;
      if (typeof expected !== "boolean") {
        return false;
      }
      return expected
        ? populatedAnswers.length > 0
        : populatedAnswers.length === 0;
    }

    case "=": {
      const expected = getAnswer(
        condition,
        ANSWER_TYPE_TO_DATA_TYPE[question.type],
      );
      if (expected === undefined) {
        return false;
      }

      for (const answer of populatedAnswers) {
        const actual = answer.value;
        if (actual == null) continue;
        if (
          valuesEqual(actual, expected, ANSWER_TYPE_TO_DATA_TYPE[question.type])
        ) {
          return true;
        }
      }
      return false;
    }

    case "!=": {
      const expected = getAnswer(
        condition,
        ANSWER_TYPE_TO_DATA_TYPE[question.type],
      );
      if (expected === undefined) {
        return false;
      }

      let comparable = false;
      for (const answer of populatedAnswers) {
        const actual = answer.value;
        if (actual == null) continue;
        comparable = true;
        if (
          valuesEqual(actual, expected, ANSWER_TYPE_TO_DATA_TYPE[question.type])
        ) {
          return false;
        }
      }
      return comparable;
    }

    case ">":
    case ">=":
    case "<":
    case "<=": {
      const expected = getAnswer(
        condition,
        ANSWER_TYPE_TO_DATA_TYPE[question.type],
      );
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
          for (const answer of populatedAnswers) {
            const actual = answer.value;
            if (actual == null) continue;
            const diff = compareValues(
              actual,
              expected,
              ANSWER_TYPE_TO_DATA_TYPE[question.type],
            );
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

export function valuesEqual(
  actual: unknown,
  expected: unknown,
  type: DataType,
) {
  switch (type) {
    case "decimal":
    case "integer":
    case "string":
    case "url":
    case "boolean":
      return actual === expected;
    case "date":
      return areDateValuesEqual(actual, expected);
    case "dateTime":
      return areDateTimeValuesEqual(actual, expected);
    case "time":
      return areTimeValuesEqual(actual, expected);
    case "Coding":
      return areCodingsEqual(actual, expected);
    case "Quantity":
      return areQuantitiesEqual(actual, expected);
    case "Reference":
      return areReferencesEqual(actual, expected);
    case "Attachment":
      return areAttachmentsEqual(actual, expected);
    case "base64Binary":
    case "canonical":
    case "code":
    case "id":
    case "instant":
    case "integer64":
    case "markdown":
    case "oid":
    case "positiveInt":
    case "unsignedInt":
    case "uri":
    case "uuid":
    case "Address":
    case "Age":
    case "Annotation":
    case "CodeableConcept":
    case "CodeableReference":
    case "ContactPoint":
    case "Count":
    case "Distance":
    case "Duration":
    case "HumanName":
    case "Identifier":
    case "Money":
    case "Period":
    case "Range":
    case "Ratio":
    case "RatioRange":
    case "SampledData":
    case "Signature":
    case "Timing":
    case "ContactDetail":
    case "DataRequirement":
    case "Expression":
    case "ParameterDefinition":
    case "RelatedArtifact":
    case "TriggerDefinition":
    case "UsageContext":
    case "Availability":
    case "ExtendedContactDetail":
    case "Dosage":
    case "Meta": {
      throw new Error('Not implemented yet: "Meta" case');
    }
    default:
      return actual === expected;
  }
}

export function compareValues(
  actual: unknown,
  expected: unknown,
  type: DataType,
): number | undefined {
  switch (type) {
    case "decimal":
    case "integer":
      return compareNumbers(actual, expected);
    case "date":
      return compareDateValues(actual, expected);
    case "dateTime":
      return compareDateTimeValues(actual, expected);
    case "time":
      return compareTimeValues(actual, expected);
    case "string":
    case "url":
      return compareStringValues(actual, expected);
    case "Quantity":
      return compareQuantities(actual, expected);
    case "boolean":
    case "base64Binary":
    case "canonical":
    case "code":
    case "id":
    case "instant":
    case "integer64":
    case "markdown":
    case "oid":
    case "positiveInt":
    case "unsignedInt":
    case "uri":
    case "uuid":
    case "Address":
    case "Age":
    case "Annotation":
    case "Attachment":
    case "CodeableConcept":
    case "CodeableReference":
    case "Coding":
    case "ContactPoint":
    case "Count":
    case "Distance":
    case "Duration":
    case "HumanName":
    case "Identifier":
    case "Money":
    case "Period":
    case "Range":
    case "Ratio":
    case "RatioRange":
    case "Reference":
    case "SampledData":
    case "Signature":
    case "Timing":
    case "ContactDetail":
    case "DataRequirement":
    case "Expression":
    case "ParameterDefinition":
    case "RelatedArtifact":
    case "TriggerDefinition":
    case "UsageContext":
    case "Availability":
    case "ExtendedContactDetail":
    case "Dosage":
    case "Meta": {
      throw new Error('Not implemented yet: "Meta" case');
    }
  }
}

export function booleanify(value: unknown): boolean {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return false;
    }
    return booleanify(value[value.length - 1]);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0 && !Number.isNaN(value);
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return value != null;
}

export function cloneValue<T>(value: T): T {
  if (value && typeof value === "object") {
    return structuredClone(value);
  }
  return value;
}

export function stringifyValue<T extends DataType>(
  type: T,
  value: DataTypeToType<T>,
  fallback: string = "",
): string {
  if (value == null) {
    return fallback;
  }

  if (type === "date" && typeof value === "string") {
    return formatDateForDisplay(value) ?? fallback;
  }

  if (type === "dateTime" && typeof value === "string") {
    return formatDateTimeForDisplay(value) ?? fallback;
  }

  if (type === "time" && typeof value === "string") {
    return formatTimeValue(value) ?? fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (type === "Coding" && isCoding(value)) {
    return value.display ?? value.code ?? fallback;
  }

  if (type === "Quantity" && isQuantity(value)) {
    const quantity = value as Quantity;
    const pieces = [
      quantity.value != null ? String(quantity.value) : undefined,
      quantity.unit,
    ].filter(Boolean);
    return pieces.join(" ") || fallback;
  }

  if (type === "Reference") {
    const ref = value as Reference;
    return ref.display ?? ref.reference ?? fallback;
  }

  if (type === "Attachment") {
    const attachment = value as Attachment;
    return (
      attachment.title ??
      attachment.url ??
      (attachment.contentType
        ? `${attachment.contentType} attachment`
        : fallback)
    );
  }

  return fallback;
}

export function areValuesEqual<T extends DataType>(
  type: T,
  a: DataTypeToType<T>,
  b: DataTypeToType<T>,
): boolean {
  switch (type) {
    case "Coding":
      return areCodingsEqual(a, b);
    case "Quantity":
      return areQuantitiesEqual(a, b);
    case "Reference":
      return areReferencesEqual(a, b);
    case "Attachment":
      return areAttachmentsEqual(a, b);
    case "string":
    case "boolean":
    case "decimal":
    case "integer":
    case "url":
      return a === b;
    case "date":
      return areDateValuesEqual(a, b);
    case "dateTime":
      return areDateTimeValuesEqual(a, b);
    case "time":
      return areTimeValuesEqual(a, b);
    case "base64Binary":
    case "canonical":
    case "code":
    case "id":
    case "instant":
    case "integer64":
    case "markdown":
    case "oid":
    case "positiveInt":
    case "unsignedInt":
    case "uri":
    case "uuid":
    case "Address":
    case "Age":
    case "Annotation":
    case "CodeableConcept":
    case "CodeableReference":
    case "ContactPoint":
    case "Count":
    case "Distance":
    case "Duration":
    case "HumanName":
    case "Identifier":
    case "Money":
    case "Period":
    case "Range":
    case "Ratio":
    case "RatioRange":
    case "SampledData":
    case "Signature":
    case "Timing":
    case "ContactDetail":
    case "DataRequirement":
    case "Expression":
    case "ParameterDefinition":
    case "RelatedArtifact":
    case "TriggerDefinition":
    case "UsageContext":
    case "Availability":
    case "ExtendedContactDetail":
    case "Dosage":
    case "Meta": {
      throw new Error('Not implemented yet: "Meta" case');
    }
  }
}

export function normalizeExpressionValues<T extends AnswerType>(
  type: T,
  value: unknown,
): Array<DataTypeToType<AnswerTypeToDataType<T>> | null> {
  const collection = Array.isArray(value) ? value : [value];
  const result: Array<DataTypeToType<AnswerTypeToDataType<T>> | null> = [];
  collection.forEach((entry) => {
    const coerced = coerceExpressionValue(type, entry);
    if (coerced !== undefined) {
      result.push(coerced);
    }
  });
  return result;
}

export function coerceExpressionValue<T extends AnswerType>(
  type: T,
  value: unknown,
): DataTypeToType<AnswerTypeToDataType<T>> | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  switch (type) {
    case "boolean":
      if (typeof value === "boolean")
        return value as DataTypeToType<AnswerTypeToDataType<T>>;
      if (typeof value === "string") {
        if (/^true$/i.test(value))
          return true as DataTypeToType<AnswerTypeToDataType<T>>;
        if (/^false$/i.test(value))
          return false as DataTypeToType<AnswerTypeToDataType<T>>;
      }
      return undefined;
    case "decimal":
    case "integer": {
      const numberValue = parseNumber(value);
      return numberValue as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "date":
    case "dateTime":
    case "time":
    case "string":
    case "text":
    case "url":
      return typeof value === "string"
        ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
        : undefined;
    case "coding":
    case "attachment":
    case "reference":
      return value && typeof value === "object"
        ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
        : undefined;
    case "quantity":
      if (typeof value === "string") {
        const parsedQuantity = parseQuantityString(value);
        if (parsedQuantity) {
          return parsedQuantity as DataTypeToType<AnswerTypeToDataType<T>>;
        }
      }

      return value && typeof value === "object" && isQuantity(value)
        ? (value as DataTypeToType<AnswerTypeToDataType<T>>)
        : undefined;
    default:
      return undefined;
  }
}

export function withQuestionnaireResponseItemMeta(
  item: QuestionnaireResponseItem,
): QuestionnaireResponseItem {
  if (!Object.hasOwn(item, "__path__")) {
    Object.defineProperty(item, "__path__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: {
        model: r5,
        fhirNodeDataType: "QuestionnaireResponse.item",
        propName: "item",
        path: "QuestionnaireResponse.item",
        parentResNode: null,
        index: null,
      },
    });
  }

  return item;
}
