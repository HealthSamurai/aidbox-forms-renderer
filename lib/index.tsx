import { useMemo } from "react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form-store.ts";
import { Form } from "./components/form.tsx";

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

  return <Form store={store} onSubmit={onSubmit} onChange={onChange} />;
}

export default Renderer;
