import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form/form-store.ts";
import { Form } from "./components/form/form.tsx";
import { FormEvent, useCallback, useEffect, useMemo } from "react";
import { autorun } from "mobx";

type RendererProps = {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
  terminologyServerUrl?: string | undefined;
};

function Renderer({
  questionnaire,
  initialResponse,
  onSubmit,
  onChange,
  terminologyServerUrl,
}: RendererProps) {
  const store = useMemo(
    () => new FormStore(questionnaire, initialResponse, terminologyServerUrl),
    [questionnaire, initialResponse, terminologyServerUrl],
  );

  useEffect(() => () => store.dispose(), [store]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const dispose = autorun(() => {
      onChange(store.response);
    });

    return () => {
      dispose();
    };
  }, [onChange, store]);

  const handleValidSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(store.response);
    }
  }, [onSubmit, store]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const isValid = store.validateAll();
      if (isValid) {
        handleValidSubmit();
      }
    },
    [handleValidSubmit, store],
  );

  return store && <Form store={store} onSubmit={handleSubmit} />;
}

export default Renderer;
export type { IValueSetExpander } from "./types.ts";
export { ValueSetExpander } from "./stores/services/valueset-expander.ts";
export { HsUiDemo } from "./components/hs-ui-demo.tsx";
