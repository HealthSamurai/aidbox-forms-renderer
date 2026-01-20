import type {
  Extension,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireItemInitial,
} from "fhir/r5";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  ItemControl,
  QuestionItemControl,
} from "@formbox/renderer/types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  EXT,
  ITEM_CONTROL_SYSTEM,
} from "@formbox/renderer/utilities.ts";

export type QuestionItemConfig<T extends AnswerType> = {
  linkId: string;
  text: string;
  type: T;
  control?: QuestionItemControl | undefined;
  answerConstraint?: QuestionnaireItem["answerConstraint"] | undefined;
  answerOption?: QuestionnaireItemAnswerOption[] | undefined;
  repeats?: boolean | undefined;
  readOnly?: boolean | undefined;
  initial?: QuestionnaireItem["initial"] | undefined;
  extensions?: Extension[] | undefined;
  item?: QuestionnaireItem[] | undefined;
};

export function buildQuestionItem<T extends AnswerType>(
  options: QuestionItemConfig<T>,
): QuestionnaireItem {
  const extensions = [...(options.extensions ?? [])];

  if (options.control) {
    extensions.push({
      url: EXT.ITEM_CONTROL,
      valueCodeableConcept: {
        coding: [
          {
            system: ITEM_CONTROL_SYSTEM,
            code: options.control,
          },
        ],
      },
    });
  }

  if (options.repeats) {
    // extensions.push({
    //   url: EXT.MIN_OCCURS,
    //   valueInteger: 1,
    // });
    // extensions.push({
    //   url: EXT.MAX_OCCURS,
    //   valueInteger: 3,
    // });
  }

  return {
    linkId: options.linkId,
    text: options.text,
    type: options.type,
    repeats: options.repeats,
    readOnly: options.readOnly,
    answerOption:
      options.answerOption && options.answerOption.length > 0
        ? options.answerOption
        : undefined,
    answerConstraint: options.answerConstraint,
    initial:
      options.initial && options.initial.length > 0
        ? options.initial
        : undefined,
    extension: extensions.length > 0 ? extensions : undefined,
    item: options.item && options.item.length > 0 ? options.item : undefined,
  };
}

export function buildDisplayItem(options: {
  linkId: string;
  text: string;
  control: ItemControl;
}): QuestionnaireItem {
  return {
    linkId: options.linkId,
    text: options.text,
    type: "display",
    extension: [
      {
        url: EXT.ITEM_CONTROL,
        valueCodeableConcept: {
          coding: [
            {
              system: ITEM_CONTROL_SYSTEM,
              code: options.control,
            },
          ],
        },
      },
    ],
  };
}

export function makeAnswerOptions<T extends AnswerType>(
  type: T,
  values: Array<DataTypeToType<AnswerTypeToDataType<T>>>,
): QuestionnaireItemAnswerOption[] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[type];
  return values.map(
    (value) =>
      asAnswerFragment(dataType, value) as QuestionnaireItemAnswerOption,
  );
}

export function makeInitialValues<T extends AnswerType>(
  type: T,
  values: Array<DataTypeToType<AnswerTypeToDataType<T>>>,
): QuestionnaireItemInitial[] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[type];
  return values.map((value) => asAnswerFragment(dataType, value));
}

export function buildQuestionnaire(item: QuestionnaireItem): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [item],
  };
}
