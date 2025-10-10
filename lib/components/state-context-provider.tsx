import { ReactNode, useMemo } from "react";

import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { StateContext } from "../state/state-context.ts";
import { useQuestionnaireState } from "../state/use-questionnaire-state.ts";

/**
 * Wraps children with a Questionnaire-aware context backed by the
 * `useQuestionnaireState` hook. The provider exposes the current
 * QuestionnaireResponse plus helpers for reading/writing answers.
 */
interface StateContextProviderProps {
  questionnaire: Questionnaire;
  children: ReactNode;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
}

export function StateContextProvider({
  questionnaire,
  children,
  initialResponse,
  onChange,
}: StateContextProviderProps) {
  const { response, readValue, writeValue, reset } = useQuestionnaireState({
    questionnaire,
    initialResponse,
    onChange,
  });

  const contextValue = useMemo(
    () => ({ questionnaire, response, readValue, writeValue, reset }),
    [questionnaire, response, readValue, writeValue, reset],
  );

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}
