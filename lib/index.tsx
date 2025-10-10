import "./index.css";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import QuestionnaireRenderer from "./components/questionnaire-renderer.tsx";
import { StateContextProvider } from "./components/state-context-provider.tsx";

export type { AnswerPrimitive } from "./types";
export type {
  Attachment,
  Coding,
  Quantity,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
  Reference,
} from "fhir/r5";

type RendererProps = {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
};

function Renderer({
  questionnaire,
  initialResponse,
  onChange,
  onSubmit,
}: RendererProps) {
  return (
    <StateContextProvider
      questionnaire={questionnaire}
      initialResponse={initialResponse}
      onChange={onChange}
    >
      <QuestionnaireRenderer onSubmit={onSubmit} />
    </StateContextProvider>
  );
}

export default Renderer;
