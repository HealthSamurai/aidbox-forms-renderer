import type { Coding, QuestionnaireItem } from "fhir/r5";

import type { AnswerPrimitive } from "../types";

export type QuestionnaireAnswerOption = NonNullable<
  QuestionnaireItem["answerOption"]
>[number];

export function getCodingLabel(option: QuestionnaireAnswerOption): string {
  if (option.valueCoding) {
    return option.valueCoding.display ?? option.valueCoding.code ?? "Option";
  }
  if (option.valueString !== undefined) {
    return option.valueString;
  }
  if (option.valueInteger !== undefined) {
    return String(option.valueInteger);
  }
  if (option.valueDate) {
    return option.valueDate;
  }
  if (option.valueTime) {
    return option.valueTime;
  }
  return "Option";
}

export function getCodingValue(
  option: QuestionnaireAnswerOption,
): AnswerPrimitive | undefined {
  if (option.valueCoding) {
    return option.valueCoding;
  }
  if (option.valueString !== undefined) {
    return option.valueString;
  }
  if (option.valueInteger !== undefined) {
    return option.valueInteger;
  }
  if (option.valueDate) {
    return option.valueDate;
  }
  if (option.valueTime) {
    return option.valueTime;
  }
  return undefined;
}

export function isSameCodingValue(
  optionValue: AnswerPrimitive | undefined,
  currentValue: AnswerPrimitive | undefined,
): boolean {
  if (optionValue === undefined) {
    return currentValue === undefined;
  }

  if (currentValue === undefined) {
    return false;
  }

  if (typeof optionValue !== "object" || optionValue === null) {
    return optionValue === currentValue;
  }

  if (typeof currentValue !== "object" || currentValue === null) {
    return false;
  }

  const target = optionValue as Coding;
  const current = currentValue as Coding;

  return (
    target.code === current.code &&
    target.system === current.system &&
    target.display === current.display
  );
}
