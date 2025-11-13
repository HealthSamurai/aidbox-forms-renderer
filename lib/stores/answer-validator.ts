import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue, Quantity } from "fhir/r5";

import {
  ANSWER_TYPE_TO_DATA_TYPE,
  compareDateTimeValues,
  compareDateValues,
  compareQuantities,
  compareTimeValues,
  countDecimalPlaces,
  estimateAttachmentSize,
  EXT,
  extractExtensionValue,
  findExtensions,
  isQuantity,
  makeIssue,
  normalizeExpressionValues,
  stringifyValue,
} from "../utils.ts";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  INodeValidator,
  IQuestionNode,
} from "./types.ts";

export class AnswerValidator<T extends AnswerType = AnswerType>
  implements INodeValidator
{
  private readonly answer: IAnswerInstance<
    DataTypeToType<AnswerTypeToDataType<T>>
  >;
  private readonly question: IQuestionNode<T>;

  constructor(
    answer: IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>,
    question: IQuestionNode<T>,
  ) {
    this.answer = answer;
    this.question = question;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (this.question.readOnly || !this.question.isEnabled) {
      return [];
    }

    const shouldValidate =
      this.question.form.isSubmitAttempted || this.question.isDirty;
    if (!shouldValidate) {
      return [];
    }

    const type = this.question.type;
    const value = this.answer.value as DataTypeToType<
      AnswerTypeToDataType<T>
    > | null;

    let issues: OperationOutcomeIssue[];
    switch (type) {
      case "string":
      case "text": {
        const template = this.question.template;
        const maxLength = template.maxLength;
        const configuredMinLength = this.getMinLength();
        const minLength =
          configuredMinLength != null &&
          maxLength != null &&
          configuredMinLength > maxLength
            ? undefined
            : configuredMinLength;

        if (typeof value !== "string") {
          issues = [];
          break;
        }

        const stringIssues: OperationOutcomeIssue[] = [];

        if (minLength != null && value.length < minLength) {
          stringIssues.push(
            makeIssue(
              "invalid",
              `Response must be at least ${minLength} characters long.`,
            ),
          );
        }

        if (maxLength != null && value.length > maxLength) {
          stringIssues.push(
            makeIssue(
              "invalid",
              `Response exceeds the maximum length of ${maxLength}.`,
            ),
          );
        }

        issues = stringIssues;
        break;
      }
      case "integer":
        {
          let numberMin = this.resolveNumberBound("min", type);
          let numberMax = this.resolveNumberBound("max", type);
          if (numberMin != null && numberMax != null && numberMin > numberMax) {
            numberMin = undefined;
            numberMax = undefined;
          }
          issues = this.validateNumericValue(
            value as DataTypeToType<"integer"> | null,
            numberMin,
            numberMax,
          );
        }
        break;
      case "decimal":
        {
          let numberMin = this.resolveNumberBound("min", type);
          let numberMax = this.resolveNumberBound("max", type);
          if (numberMin != null && numberMax != null && numberMin > numberMax) {
            numberMin = undefined;
            numberMax = undefined;
          }
          let maxDecimalPlaces = this.getMaxDecimalPlaces();
          if (maxDecimalPlaces != null && maxDecimalPlaces < 0) {
            maxDecimalPlaces = undefined;
          }
          issues = this.validateNumericValue(
            value as DataTypeToType<"decimal"> | null,
            numberMin,
            numberMax,
            maxDecimalPlaces,
          );
        }
        break;
      case "date":
      case "dateTime":
      case "time": {
        const template = this.question.template;
        const maxLength = template.maxLength;
        const configuredMinLength = this.getMinLength();
        const minLength =
          configuredMinLength != null &&
          maxLength != null &&
          configuredMinLength > maxLength
            ? undefined
            : configuredMinLength;
        let comparableMin = this.resolveTemporalBound("min", type);
        let comparableMax = this.resolveTemporalBound("max", type);
        if (
          comparableMin != null &&
          comparableMax != null &&
          comparableMin > comparableMax
        ) {
          comparableMin = undefined;
          comparableMax = undefined;
        }
        issues = this.validateTemporalValue(
          value as
            | DataTypeToType<"date">
            | DataTypeToType<"dateTime">
            | DataTypeToType<"time">
            | null,
          {
            minLength,
            maxLength,
            comparableMin,
            comparableMax,
          },
          type,
        );
        break;
      }
      case "quantity":
        {
          let quantityMin = this.resolveQuantityBound("min");
          let quantityMax = this.resolveQuantityBound("max");
          if (quantityMin && quantityMax) {
            const comparison = compareQuantities(quantityMin, quantityMax);
            if (comparison === undefined) {
              quantityMin = undefined;
              quantityMax = undefined;
            } else if (
              typeof quantityMin.value === "number" &&
              typeof quantityMax.value === "number" &&
              quantityMin.value > quantityMax.value
            ) {
              quantityMin = undefined;
              quantityMax = undefined;
            }
          }
          const quantityValue = value as DataTypeToType<"Quantity"> | null;
          if (!quantityValue || typeof quantityValue.value !== "number") {
            issues = [];
            break;
          }

          const quantityIssues: OperationOutcomeIssue[] = [];

          if (quantityMin) {
            const diff = compareQuantities(quantityValue, quantityMin);
            if (diff === undefined || diff < 0) {
              const formattedMin = stringifyValue("Quantity", quantityMin);
              quantityIssues.push(
                makeIssue(
                  "invalid",
                  `Quantity must be greater than or equal to ${formattedMin}.`,
                ),
              );
            }
          }

          if (quantityMax) {
            const diff = compareQuantities(quantityValue, quantityMax);
            if (diff === undefined || diff > 0) {
              const formattedMax = stringifyValue("Quantity", quantityMax);
              quantityIssues.push(
                makeIssue(
                  "invalid",
                  `Quantity must be less than or equal to ${formattedMax}.`,
                ),
              );
            }
          }

          issues = quantityIssues;
        }
        break;
      case "attachment":
        {
          const attachment = value as DataTypeToType<"Attachment"> | null;
          if (!attachment) {
            issues = [];
            break;
          }

          const attachmentIssues: OperationOutcomeIssue[] = [];
          const mimeTypes = this.getAttachmentMimeTypes();
          const normalizedAllowed = mimeTypes.map((type) => type.toLowerCase());

          if (normalizedAllowed.length > 0) {
            const actualType = attachment.contentType?.toLowerCase();
            if (!actualType) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  `Attachment must declare a content type from the allowed list (${normalizedAllowed.join(", ")}).`,
                ),
              );
            } else if (!normalizedAllowed.includes(actualType)) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  `Attachment must be one of the allowed content types (${normalizedAllowed.join(", ")}).`,
                ),
              );
            }
          }

          const maxAttachmentSize = this.getAttachmentMaxSize();
          if (maxAttachmentSize != null) {
            const effectiveSize = estimateAttachmentSize(attachment);
            if (effectiveSize != null && effectiveSize > maxAttachmentSize) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  `Attachment must not exceed ${maxAttachmentSize} bytes.`,
                ),
              );
            }
          }

          issues = attachmentIssues;
        }
        break;
      case "boolean":
      case "url":
      case "coding":
      case "reference":
        issues = [];
        break;
    }

    return issues;
  }

  private validateNumericValue(
    value: number | null,
    min: number | undefined,
    max: number | undefined,
    maxDecimalPlaces?: number,
  ): OperationOutcomeIssue[] {
    if (typeof value !== "number") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (min != null && value < min) {
      const formattedMin = stringifyValue(
        ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
        min as DataTypeToType<AnswerTypeToDataType<T>>,
      );
      issues.push(
        makeIssue(
          "invalid",
          `Value must be greater than or equal to ${formattedMin}.`,
        ),
      );
    }

    if (max != null && value > max) {
      const formattedMax = stringifyValue(
        ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
        max as DataTypeToType<AnswerTypeToDataType<T>>,
      );
      issues.push(
        makeIssue(
          "invalid",
          `Value must be less than or equal to ${formattedMax}.`,
        ),
      );
    }

    if (maxDecimalPlaces != null) {
      const decimals = countDecimalPlaces(value);
      if (decimals > maxDecimalPlaces) {
        issues.push(
          makeIssue(
            "invalid",
            `Value must not exceed ${maxDecimalPlaces} decimal place(s).`,
          ),
        );
      }
    }

    return issues;
  }

  private validateTemporalValue(
    value: string | null,
    constraints: {
      minLength: number | undefined;
      maxLength: number | undefined;
      comparableMin: string | undefined;
      comparableMax: string | undefined;
    },
    type: "date" | "dateTime" | "time",
  ): OperationOutcomeIssue[] {
    if (typeof value !== "string") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (value.trim().length === 0) {
      issues.push(makeIssue("invalid", "Response must not be blank."));
    }

    if (constraints.minLength != null && value.length < constraints.minLength) {
      issues.push(
        makeIssue(
          "invalid",
          `Response must be at least ${constraints.minLength} characters to capture the required precision.`,
        ),
      );
    }

    if (constraints.maxLength != null && value.length > constraints.maxLength) {
      issues.push(
        makeIssue(
          "invalid",
          `Response must not exceed ${constraints.maxLength} characters.`,
        ),
      );
    }

    if (constraints.comparableMin != null) {
      const comparison = this.compareTemporal(
        type,
        value,
        constraints.comparableMin,
      );
      if (comparison != null && comparison < 0) {
        const formattedMin = stringifyValue(
          ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
          constraints.comparableMin as DataTypeToType<AnswerTypeToDataType<T>>,
        );
        issues.push(
          makeIssue(
            "invalid",
            `Value must not be earlier than ${formattedMin}.`,
          ),
        );
      }
    }

    if (constraints.comparableMax != null) {
      const comparison = this.compareTemporal(
        type,
        value,
        constraints.comparableMax,
      );
      if (comparison != null && comparison > 0) {
        const formattedMax = stringifyValue(
          ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
          constraints.comparableMax as DataTypeToType<AnswerTypeToDataType<T>>,
        );
        issues.push(
          makeIssue("invalid", `Value must not be later than ${formattedMax}.`),
        );
      }
    }

    return issues;
  }

  private compareTemporal(
    type: "date" | "dateTime" | "time",
    actual: string,
    expected: string,
  ): number | null {
    let comparison: number | undefined;
    switch (type) {
      case "date":
        comparison = compareDateValues(actual, expected);
        break;
      case "dateTime":
        comparison = compareDateTimeValues(actual, expected);
        break;
      case "time":
        comparison = compareTimeValues(actual, expected);
        break;
      default:
        comparison = undefined;
    }

    if (comparison === undefined) {
      return actual.localeCompare(expected);
    }

    return comparison;
  }

  private getAttachmentMimeTypes(): string[] {
    const template = this.question.template;
    return findExtensions(template, EXT.MIME_TYPE)
      .map((extension) => extension.valueCode)
      .filter(
        (code): code is string => typeof code === "string" && code.length > 0,
      );
  }

  private getAttachmentMaxSize(): number | undefined {
    const template = this.question.template;
    const value = extractExtensionValue(template, EXT.MAX_SIZE, "decimal");
    return typeof value === "number" && Number.isFinite(value) && value >= 0
      ? value
      : undefined;
  }

  private getMinLength(): number | undefined {
    const value = extractExtensionValue(
      this.question.template,
      EXT.MIN_LENGTH,
      "integer",
    );
    return typeof value === "number" ? value : undefined;
  }

  private getMaxDecimalPlaces(): number | undefined {
    const template = this.question.template;
    const value = extractExtensionValue(
      template,
      EXT.MAX_DECIMAL_PLACES,
      "integer",
    );
    return typeof value === "number" ? value : undefined;
  }

  private resolveNumberBound(
    kind: "min" | "max",
    type: "integer" | "decimal",
  ): number | undefined {
    const template = this.question.template;

    const slot =
      kind === "min"
        ? this.question.expressionRegistry?.minValue
        : this.question.expressionRegistry?.maxValue;

    if (slot !== undefined) {
      const source = Array.isArray(slot.value) ? slot.value[0] : slot.value;
      const candidate = normalizeExpressionValues(type, source).at(0);
      return typeof candidate === "number" && Number.isFinite(candidate)
        ? candidate
        : undefined;
    }

    const url = kind === "min" ? EXT.MIN_VALUE : EXT.MAX_VALUE;
    return extractExtensionValue(template, url, type);
  }

  private resolveTemporalBound(
    kind: "min" | "max",
    type: "date" | "dateTime" | "time",
  ): string | undefined {
    const template = this.question.template;
    const slot =
      kind === "min"
        ? this.question.expressionRegistry.minValue
        : this.question.expressionRegistry.maxValue;

    if (slot !== undefined) {
      const source = Array.isArray(slot.value) ? slot.value[0] : slot.value;
      const candidate = normalizeExpressionValues(type, source).at(0);
      return typeof candidate === "string" ? candidate : undefined;
    }

    const url = kind === "min" ? EXT.MIN_VALUE : EXT.MAX_VALUE;

    switch (type) {
      case "date":
        return extractExtensionValue(template, url, "date");
      case "dateTime":
        return extractExtensionValue(template, url, "dateTime");
      case "time":
        return extractExtensionValue(template, url, "time");
    }
  }

  private resolveQuantityBound(kind: "min" | "max"): Quantity | undefined {
    const template = this.question.template;

    const slot =
      kind === "min"
        ? (this.question.expressionRegistry.minQuantity ??
          this.question.expressionRegistry.minValue)
        : (this.question.expressionRegistry.maxQuantity ??
          this.question.expressionRegistry.maxValue);

    if (slot !== undefined) {
      const source = Array.isArray(slot.value) ? slot.value[0] : slot.value;
      const resolved = normalizeExpressionValues("quantity", source).at(0);
      if (resolved) {
        return isQuantity(resolved) ? resolved : undefined;
      }
    }

    return (
      extractExtensionValue(
        template,
        kind === "min" ? EXT.SDC_MIN_QUANTITY : EXT.SDC_MAX_QUANTITY,
        "Quantity",
      ) ??
      extractExtensionValue(
        template,
        kind === "min" ? EXT.MIN_VALUE : EXT.MAX_VALUE,
        "Quantity",
      )
    );
  }
}
