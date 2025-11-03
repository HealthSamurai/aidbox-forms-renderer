import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form-store.ts";
import { Form } from "./components/form.tsx";
import { useMemo } from "react";

type RendererProps = {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
};

function Renderer({
  questionnaire,
  initialResponse,
  onSubmit,
  onChange,
}: RendererProps) {
  const store = useMemo(
    () => new FormStore(questionnaire, initialResponse),
    [questionnaire, initialResponse],
  );

  return (
    store && <Form store={store} onSubmit={onSubmit} onChange={onChange} />
  );
}

export default Renderer;
