import type {
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";
import type { QuestionnaireIndex, QuestionnairePathSegment } from "./questionnaire-index";

/**
 * Walks (and optionally materialises) the QuestionnaireResponse tree using the
 * pre-computed questionnaire index. This is the only place that mutates the
 * response structure directly, so it guarantees we never diverge from FHIR
 * semantics while editing answers.
 */

interface LocateOptions {
  create?: boolean;
}

export interface LocateResult {
  item?: QuestionnaireResponseItem;
  answer?: QuestionnaireResponseItemAnswer;
  segments?: QuestionnairePathSegment[];
}

export function locateResponseItem(
  index: QuestionnaireIndex,
  response: QuestionnaireResponse,
  linkId: string,
  options: LocateOptions = {},
): LocateResult {
  const segments = index.get(linkId);

  if (!segments || segments.length === 0) {
    return {};
  }

  if (!response.item) {
    if (!options.create) {
      return { segments };
    }

    response.item = [];
  }

  let currentItems: QuestionnaireResponseItem[] | undefined = response.item;
  let currentItem: QuestionnaireResponseItem | undefined;
  let currentAnswer: QuestionnaireResponseItemAnswer | undefined;

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;

    if (!segment.viaAnswer) {
      if (!currentItems) {
        if (!options.create) {
          return { segments };
        }

        currentItems = [];
        if (currentAnswer) {
          currentAnswer.item = currentItems;
        } else if (currentItem) {
          currentItem.item = currentItems;
        } else {
          response.item = currentItems;
        }
      }

      let nextItem: QuestionnaireResponseItem | undefined = currentItems.find(
        (candidate) => candidate.linkId === segment.item.linkId,
      );

      if (!nextItem) {
        if (!options.create) {
          return { segments };
        }

        nextItem = { linkId: segment.item.linkId };
        if (segment.item.text) {
          nextItem.text = segment.item.text;
        }
        currentItems.push(nextItem);
      }

      currentItem = nextItem;
      if (!currentItem) {
        return { segments };
      }
      currentAnswer = undefined;

      if (isLast) {
        return currentItem ? { item: currentItem, segments } : { segments };
      }

      currentItems = currentItem.item;
      continue;
    }

    if (!currentItem) {
      return { segments };
    }

    const answers = ensureAnswers(currentItem, options.create);

    if (!answers) {
      return { segments };
    }

    currentAnswer = answers[0];

    const items = ensureAnswerItems(currentAnswer, options.create);

    if (!items) {
      return { segments };
    }

    let nextItem: QuestionnaireResponseItem | undefined = items.find(
      (candidate) => candidate.linkId === segment.item.linkId,
    );

    if (!nextItem) {
      if (!options.create) {
        return { segments };
      }

      nextItem = { linkId: segment.item.linkId };
      if (segment.item.text) {
        nextItem.text = segment.item.text;
      }
      items.push(nextItem);
    }

    currentItem = nextItem;
    if (!currentItem) {
      return { segments };
    }

    if (isLast) {
      const result: LocateResult = { segments };
      if (currentAnswer) {
        result.answer = currentAnswer;
      }
      if (currentItem) {
        result.item = currentItem;
      }
      return result;
    }

    currentItems = currentItem.item;
  }

  const result: LocateResult = { segments };
  if (currentAnswer) {
    result.answer = currentAnswer;
  }
  if (currentItem) {
    result.item = currentItem;
  }

  return result;
}

function ensureAnswers(
  item: QuestionnaireResponseItem,
  create?: boolean,
): QuestionnaireResponseItemAnswer[] | undefined {
  if (!item.answer || item.answer.length === 0) {
    if (!create) {
      return undefined;
    }

    item.answer = [{}];
  }

  if (!item.answer[0]) {
    item.answer[0] = {};
  }

  return item.answer;
}

function ensureAnswerItems(
  answer: QuestionnaireResponseItemAnswer,
  create?: boolean,
): QuestionnaireResponseItem[] | undefined {
  if (!answer.item) {
    if (!create) {
      return undefined;
    }

    answer.item = [];
  }

  return answer.item;
}
