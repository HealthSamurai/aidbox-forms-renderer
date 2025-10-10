import type { Questionnaire, QuestionnaireItem } from "fhir/r5";

/**
 * Pre-computes traversal metadata for every Questionnaire item. Each segment
 * indicates whether the path steps through an answer (`viaAnswer`) or a group,
 * which lets the locator rebuild the correct QuestionnaireResponse shape.
 */

export interface QuestionnairePathSegment {
  item: QuestionnaireItem;
  viaAnswer: boolean;
}

export type QuestionnaireIndex = Map<string, QuestionnairePathSegment[]>;

export function buildQuestionnaireIndex(
  questionnaire: Questionnaire,
): QuestionnaireIndex {
  const index: QuestionnaireIndex = new Map();

  const visit = (
    items: QuestionnaireItem[] | undefined,
    path: QuestionnairePathSegment[],
    parent?: QuestionnaireItem,
  ) => {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (!item.linkId) {
        continue;
      }

      const viaAnswer = parent ? parent.type !== "group" : false;
      const nextPath = [...path, { item, viaAnswer }];

      if (!index.has(item.linkId)) {
        index.set(item.linkId, nextPath);
      }

      visit(item.item, nextPath, item);
    }
  };

  visit(questionnaire.item, [], undefined);

  return index;
}
