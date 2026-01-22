import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import {
  compareDateTimeValues,
  compareDateValues,
  compareQuantities,
  compareTimeValues,
  countDecimalPlaces,
  estimateAttachmentSize,
  EXT,
  formatString,
  extractExtensionValue,
  isQuantity,
  makeIssue,
  normalizeExpressionValues,
  stringifyValue,
} from "../../utilities.ts";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswer,
  INodeValidator,
  IQuestionNode,
  ValueBounds,
} from "../../types.ts";
import { strings } from "../../strings.ts";

export class AnswerValidator<
  T extends AnswerType = AnswerType,
> implements INodeValidator {
  private readonly answer: IAnswer<T>;
  private readonly question: IQuestionNode<T>;

  constructor(answer: IAnswer<T>, question: IQuestionNode<T>) {
    this.answer = answer;
    this.question = question;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (this.question.readOnly || !this.question.isEnabled) {
      return [];
    }

    if (!this.question.form.isSubmitAttempted) {
      return [];
    }

    const type = this.question.type;
    const value = this.answer.value;
    let issues: OperationOutcomeIssue[];
    switch (type) {
      case "string":
      case "text": {
        const template = this.question.template;
        const maxLength = template.maxLength;
        const minLength = this.question.minLength;

        if (typeof value !== "string") {
          issues = [];
          break;
        }

        const stringIssues: OperationOutcomeIssue[] = [];

        if (minLength != undefined && value.length < minLength) {
          stringIssues.push(
            makeIssue(
              "invalid",
              formatString(strings.validation.answer.minLength, { minLength }),
            ),
          );
        }

        if (maxLength != undefined && value.length > maxLength) {
          stringIssues.push(
            makeIssue(
              "invalid",
              formatString(strings.validation.answer.maxLength, { maxLength }),
            ),
          );
        }

        issues = stringIssues;
        break;
      }
      case "integer": {
        {
          let numberMin = this.resolveNumberBound("min", type);
          let numberMax = this.resolveNumberBound("max", type);
          if (
            numberMin != undefined &&
            numberMax != undefined &&
            numberMin > numberMax
          ) {
            numberMin = undefined;
            numberMax = undefined;
          }
          issues = this.validateNumericValue(
            value as DataTypeToType<"integer"> | undefined,
            numberMin,
            numberMax,
            type,
          );
        }
        break;
      }
      case "decimal": {
        {
          let numberMin = this.resolveNumberBound("min", type);
          let numberMax = this.resolveNumberBound("max", type);
          if (
            numberMin != undefined &&
            numberMax != undefined &&
            numberMin > numberMax
          ) {
            numberMin = undefined;
            numberMax = undefined;
          }
          const maxDecimalPlaces = this.question.maxDecimalPlaces;
          issues = this.validateNumericValue(
            value as DataTypeToType<"decimal"> | undefined,
            numberMin,
            numberMax,
            type,
            maxDecimalPlaces,
          );
        }
        break;
      }
      case "date":
      case "dateTime":
      case "time": {
        const template = this.question.template;
        const maxLength = template.maxLength;
        const minLength = this.question.minLength;
        let comparableMin = this.resolveTemporalBound("min", type);
        let comparableMax = this.resolveTemporalBound("max", type);
        if (
          comparableMin != undefined &&
          comparableMax != undefined &&
          comparableMin > comparableMax
        ) {
          comparableMin = undefined;
          comparableMax = undefined;
        }
        issues = this.validateTemporalValue(
          value as DataTypeToType<"date" | "dateTime" | "time"> | undefined,
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
      case "quantity": {
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
          const quantityValue = value as DataTypeToType<"Quantity"> | undefined;
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
                  formatString(strings.validation.answer.quantityMin, {
                    formatted: formattedMin,
                  }),
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
                  formatString(strings.validation.answer.quantityMax, {
                    formatted: formattedMax,
                  }),
                ),
              );
            }
          }

          const maxDecimalPlaces = this.question.maxDecimalPlaces;
          if (maxDecimalPlaces != undefined) {
            const decimalPlaces = countDecimalPlaces(quantityValue.value);
            if (decimalPlaces > maxDecimalPlaces) {
              quantityIssues.push(
                makeIssue(
                  "invalid",
                  formatString(strings.validation.answer.valueDecimalPlaces, {
                    maxPlaces: maxDecimalPlaces,
                  }),
                ),
              );
            }
          }

          issues = quantityIssues;
        }
        break;
      }
      case "attachment": {
        {
          const attachment = value as DataTypeToType<"Attachment"> | undefined;
          if (!attachment) {
            issues = [];
            break;
          }

          const attachmentIssues: OperationOutcomeIssue[] = [];
          const mimeTypes = this.question.mimeTypes;
          const normalizedAllowed = mimeTypes.map((type) => type.toLowerCase());

          if (normalizedAllowed.length > 0) {
            const actualType = attachment.contentType?.toLowerCase();
            if (!actualType) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  formatString(
                    strings.validation.answer.attachmentTypeRequired,
                    { allowed: normalizedAllowed.join(", ") },
                  ),
                ),
              );
            } else if (!normalizedAllowed.includes(actualType)) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  formatString(
                    strings.validation.answer.attachmentTypeAllowed,
                    { allowed: normalizedAllowed.join(", ") },
                  ),
                ),
              );
            }
          }

          const maxAttachmentSize = this.question.maxSize;
          if (maxAttachmentSize != undefined) {
            const effectiveSize = estimateAttachmentSize(attachment);
            if (
              effectiveSize != undefined &&
              effectiveSize > maxAttachmentSize
            ) {
              attachmentIssues.push(
                makeIssue(
                  "invalid",
                  formatString(strings.validation.answer.attachmentSizeMax, {
                    maxSize: maxAttachmentSize,
                  }),
                ),
              );
            }
          }

          issues = attachmentIssues;
        }
        break;
      }
      case "boolean":
      case "url":
      case "coding":
      case "reference": {
        issues = [];
        break;
      }
    }

    return issues;
  }

  private validateNumericValue(
    value: number | undefined,
    min: number | undefined,
    max: number | undefined,
    type: "integer" | "decimal",
    maxDecimalPlaces?: number,
  ): OperationOutcomeIssue[] {
    if (typeof value !== "number") {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    if (min != undefined && value < min) {
      const formattedMin = stringifyValue(type, min);
      issues.push(
        makeIssue(
          "invalid",
          formatString(strings.validation.answer.valueMin, {
            formatted: formattedMin,
          }),
        ),
      );
    }

    if (max != undefined && value > max) {
      const formattedMax = stringifyValue(type, max);
      issues.push(
        makeIssue(
          "invalid",
          formatString(strings.validation.answer.valueMax, {
            formatted: formattedMax,
          }),
        ),
      );
    }

    if (maxDecimalPlaces != undefined) {
      const decimals = countDecimalPlaces(value);
      if (decimals > maxDecimalPlaces) {
        issues.push(
          makeIssue(
            "invalid",
            formatString(strings.validation.answer.valueDecimalPlaces, {
              maxPlaces: maxDecimalPlaces,
            }),
          ),
        );
      }
    }

    return issues;
  }

  @computed.struct
  public get bounds(): ValueBounds<T> {
    let bounds: ValueBounds;

    switch (this.question.type) {
      case "integer": {
        bounds = {
          min: this.resolveNumberBound("min", "integer"),
          max: this.resolveNumberBound("max", "integer"),
        };
        break;
      }
      case "decimal": {
        bounds = {
          min: this.resolveNumberBound("min", "decimal"),
          max: this.resolveNumberBound("max", "decimal"),
        };
        break;
      }
      case "date": {
        bounds = {
          min: this.resolveTemporalBound("min", "date"),
          max: this.resolveTemporalBound("max", "date"),
        };
        break;
      }
      case "dateTime": {
        bounds = {
          min: this.resolveTemporalBound("min", "dateTime"),
          max: this.resolveTemporalBound("max", "dateTime"),
        };
        break;
      }
      case "time": {
        bounds = {
          min: this.resolveTemporalBound("min", "time"),
          max: this.resolveTemporalBound("max", "time"),
        };
        break;
      }
      case "quantity": {
        bounds = {
          min: this.resolveQuantityBound("min"),
          max: this.resolveQuantityBound("max"),
        };
        break;
      }
      case "boolean":
      case "string":
      case "text":
      case "url":
      case "coding":
      case "attachment":
      case "reference": {
        bounds = { min: undefined, max: undefined };
        break;
      }
    }

    return bounds as ValueBounds<T>;
  }

  private validateTemporalValue(
    value: string | undefined,
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
      issues.push(makeIssue("invalid", strings.validation.answer.blank));
    }

    if (
      constraints.minLength != undefined &&
      value.length < constraints.minLength
    ) {
      issues.push(
        makeIssue(
          "invalid",
          formatString(strings.validation.answer.minPrecision, {
            minLength: constraints.minLength,
          }),
        ),
      );
    }

    if (
      constraints.maxLength != undefined &&
      value.length > constraints.maxLength
    ) {
      issues.push(
        makeIssue(
          "invalid",
          formatString(strings.validation.answer.maxPrecision, {
            maxLength: constraints.maxLength,
          }),
        ),
      );
    }

    if (constraints.comparableMin != undefined) {
      const comparison = this.compareTemporal(
        type,
        value,
        constraints.comparableMin,
      );
      if (comparison != undefined && comparison < 0) {
        const formattedMin = stringifyValue(type, constraints.comparableMin);
        issues.push(
          makeIssue(
            "invalid",
            formatString(strings.validation.answer.valueNotEarlier, {
              formatted: formattedMin,
            }),
          ),
        );
      }
    }

    if (constraints.comparableMax != undefined) {
      const comparison = this.compareTemporal(
        type,
        value,
        constraints.comparableMax,
      );
      if (comparison != undefined && comparison > 0) {
        const formattedMax = stringifyValue(type, constraints.comparableMax);
        issues.push(
          makeIssue(
            "invalid",
            formatString(strings.validation.answer.valueNotLater, {
              formatted: formattedMax,
            }),
          ),
        );
      }
    }

    return issues;
  }

  private compareTemporal(
    type: "date" | "dateTime" | "time",
    actual: string,
    expected: string,
  ): number | undefined {
    let comparison: number | undefined;
    switch (type) {
      case "date": {
        comparison = compareDateValues(actual, expected);
        break;
      }
      case "dateTime": {
        comparison = compareDateTimeValues(actual, expected);
        break;
      }
      case "time": {
        comparison = compareTimeValues(actual, expected);
        break;
      }
      default: {
        comparison = undefined;
      }
    }

    if (comparison === undefined) {
      return actual.localeCompare(expected);
    }

    return comparison;
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
    return extractExtensionValue(type, template, url);
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
    return extractExtensionValue(type, template, url);
  }

  private resolveQuantityBound(
    kind: "min" | "max",
  ): DataTypeToType<AnswerTypeToDataType<"quantity">> | undefined {
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
        "Quantity",
        template,
        kind === "min" ? EXT.SDC_MIN_QUANTITY : EXT.SDC_MAX_QUANTITY,
      ) ??
      extractExtensionValue(
        "Quantity",
        template,
        kind === "min" ? EXT.MIN_VALUE : EXT.MAX_VALUE,
      )
    );
  }
}
