import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form-store.ts";
import { Form } from "./components/form.tsx";
import { useMemo } from "react";
import type { IValueSetExpander } from "./stores/valueset-types.ts";

type RendererProps = {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
  terminologyService?: IValueSetExpander | undefined;
};

function Renderer({
  questionnaire,
  initialResponse,
  onSubmit,
  onChange,
  terminologyService,
}: RendererProps) {
  const store = useMemo(
    () =>
      new FormStore(
        questionnaire,
        initialResponse,
        terminologyService ? { terminologyService } : undefined,
      ),
    [questionnaire, initialResponse, terminologyService],
  );

  return (
    store && <Form store={store} onSubmit={onSubmit} onChange={onChange} />
  );
}

export default Renderer;
export type { IValueSetExpander } from "./stores/valueset-types.ts";
export {
  RemoteValueSetExpander,
  LocalValueSetExpander,
} from "./services/valueset-expander.ts";
export { CachedValueSetExpander } from "./services/valueset-cache.ts";
