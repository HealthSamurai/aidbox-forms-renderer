import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";

/**
 * React hook that keeps QuestionnaireResponse state in its canonical FHIR shape.
 * It memoises the Questionnaire-derived index so reads and writes can be O(1)
 * by linkId while still mutating the nested response tree.
 */

import type {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
} from "fhir/r5";
import type { AnswerPrimitive } from "../types";
import { buildQuestionnaireIndex } from "./questionnaire-index";
import {
  clearAnswerPrimitive,
  readAnswerPrimitive,
  writeAnswerPrimitive,
} from "./qr-operations";
import type { QuestionnaireIndex } from "./questionnaire-index";

interface UseQuestionnaireStateArgs {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
}

interface QuestionnaireStateApi {
  response: QuestionnaireResponse;
  readValue: (item: QuestionnaireItem) => AnswerPrimitive | undefined;
  writeValue: (
    item: QuestionnaireItem,
    value: AnswerPrimitive | undefined,
  ) => void;
  reset: () => void;
}

export function useQuestionnaireState({
  questionnaire,
  initialResponse,
  onChange,
}: UseQuestionnaireStateArgs): QuestionnaireStateApi {
  const index = useMemo<QuestionnaireIndex>(
    () => buildQuestionnaireIndex(questionnaire),
    [questionnaire],
  );

  const initialValue = useMemo<QuestionnaireResponse>(() => {
    if (initialResponse) {
      return normalizeResponse(initialResponse, questionnaire);
    }

    return createEmptyResponse(questionnaire);
  }, [initialResponse, questionnaire]);

  const initialRef = useRef<QuestionnaireResponse>(cloneResponse(initialValue));
  const [response, setResponse] = useState<QuestionnaireResponse>(() =>
    cloneResponse(initialValue),
  );

  useEffect(() => {
    const next = initialResponse
      ? normalizeResponse(initialResponse, questionnaire)
      : createEmptyResponse(questionnaire);
    initialRef.current = cloneResponse(next);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResponse(next);
  }, [initialResponse, questionnaire]);

  useEffect(() => {
    if (onChange) {
      onChange(response);
    }
  }, [response, onChange]);

  const readValue = useCallback(
    (item: QuestionnaireItem) => readAnswerPrimitive(index, response, item),
    [index, response],
  );

  const writeValue = useCallback(
    (item: QuestionnaireItem, value: AnswerPrimitive | undefined) => {
      setResponse((prev) =>
        produce(prev, (draft) => {
          const currentValue = readAnswerPrimitive(index, draft, item);

          if (value === undefined) {
            if (currentValue === undefined) {
              return;
            }

            clearAnswerPrimitive(index, draft, item);
            return;
          }

          if (answerPrimitivesEqual(currentValue, value)) {
            return;
          }

          writeAnswerPrimitive(index, draft, item, value);
        }),
      );
    },
    [index],
  );

  const reset = useCallback(() => {
    setResponse(cloneResponse(initialRef.current));
  }, []);

  return { response, readValue, writeValue, reset };
}

function answerPrimitivesEqual(
  left: AnswerPrimitive | undefined,
  right: AnswerPrimitive | undefined,
): boolean {
  if (left === right) {
    return true;
  }

  if (left === undefined || right === undefined) {
    return false;
  }

  if (typeof left !== typeof right) {
    return false;
  }

  if (typeof left !== "object" || left === null || right === null) {
    return false;
  }

  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function createEmptyResponse(
  questionnaire: Questionnaire,
): QuestionnaireResponse {
  return {
    resourceType: "QuestionnaireResponse",
    questionnaire: resolveQuestionnaireReference(questionnaire),
    status: "in-progress",
    item: [],
  };
}

function cloneResponse(response: QuestionnaireResponse): QuestionnaireResponse {
  const globalStructuredClone =
    typeof globalThis !== "undefined" &&
    typeof globalThis.structuredClone === "function"
      ? globalThis.structuredClone
      : undefined;

  if (globalStructuredClone) {
    return globalStructuredClone(response);
  }

  return JSON.parse(JSON.stringify(response));
}

function normalizeResponse(
  response: QuestionnaireResponse,
  questionnaire: Questionnaire,
): QuestionnaireResponse {
  const clone = cloneResponse(response);

  if (!clone.questionnaire) {
    clone.questionnaire = resolveQuestionnaireReference(questionnaire);
  }

  if (!clone.status) {
    clone.status = "in-progress";
  }

  return clone;
}

function resolveQuestionnaireReference(questionnaire: Questionnaire): string {
  if (questionnaire.url) {
    return questionnaire.url;
  }

  if (questionnaire.id) {
    return `Questionnaire/${questionnaire.id}`;
  }

  return "Questionnaire/local";
}
