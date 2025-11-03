import { JSX } from 'react/jsx-runtime';
import { Questionnaire } from 'fhir/r5';
import { QuestionnaireResponse } from 'fhir/r5';

declare function Renderer({ questionnaire, initialResponse, onSubmit, onChange, }: RendererProps): JSX.Element | null;
export default Renderer;

declare type RendererProps = {
    questionnaire: Questionnaire;
    initialResponse?: QuestionnaireResponse | undefined;
    onChange?: ((response: QuestionnaireResponse) => void) | undefined;
    onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
};

export { }
