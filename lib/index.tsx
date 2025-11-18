import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form/form-store.ts";
import { Form } from "./components/form/form.tsx";
import { useMemo } from "react";

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

  return (
    store && <Form store={store} onSubmit={onSubmit} onChange={onChange} />
  );
}

export default Renderer;
export type { IValueSetExpander } from "./types.ts";
export { ValueSetExpander } from "./stores/services/valueset-expander.ts";
