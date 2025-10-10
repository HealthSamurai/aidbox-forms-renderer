import { createContext, useContext } from "react";

/**
 * Shared context for the questionnaire renderer. Consumers call `useStateContext`
 * to access the current questionnaire, canonical QuestionnaireResponse, and
 * helpers for reading or mutating answers.
 */

import type { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from "fhir/r5";
import type { AnswerPrimitive } from "../types.ts";

export interface StateContextValue {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse;
  readValue: (item: QuestionnaireItem) => AnswerPrimitive | undefined;
  writeValue: (item: QuestionnaireItem, value: AnswerPrimitive | undefined) => void;
  reset: () => void;
}

export const StateContext = createContext<StateContextValue | undefined>(undefined);

export function useStateContext() {
  const stateContext = useContext(StateContext);

  if (!stateContext) {
    throw new Error("useStateContext must be used within a StateContextProvider");
  }

  return stateContext;
}
