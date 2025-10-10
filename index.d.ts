import { Attachment } from 'fhir/r5';
import { Coding } from 'fhir/r5';
import { JSX } from 'react/jsx-runtime';
import { Quantity } from 'fhir/r5';
import { Questionnaire } from 'fhir/r5';
import { QuestionnaireItem } from 'fhir/r5';
import { QuestionnaireItemAnswerOption } from 'fhir/r5';
import { QuestionnaireResponse } from 'fhir/r5';
import { QuestionnaireResponseItem } from 'fhir/r5';
import { QuestionnaireResponseItemAnswer } from 'fhir/r5';
import { Reference } from 'fhir/r5';

export declare type AnswerPrimitive = string | number | boolean | Coding | Attachment | Reference | Quantity;

export { Attachment }

export { Coding }

export { Quantity }

export { Questionnaire }

export { QuestionnaireItem }

export { QuestionnaireItemAnswerOption }

export { QuestionnaireResponse }

export { QuestionnaireResponseItem }

export { QuestionnaireResponseItemAnswer }

export { Reference }

declare function Renderer({ questionnaire, initialResponse, onChange, onSubmit, }: RendererProps): JSX.Element;
export default Renderer;

declare type RendererProps = {
    questionnaire: Questionnaire;
    initialResponse?: QuestionnaireResponse | undefined;
    onChange?: ((response: QuestionnaireResponse) => void) | undefined;
    onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
};

export { }
