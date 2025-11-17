import { Coding } from 'fhir/r5';
import { JSX } from 'react/jsx-runtime';
import { Questionnaire } from 'fhir/r5';
import { QuestionnaireResponse } from 'fhir/r5';

export declare interface IValueSetExpander {
    expand(canonical: string, preferredServers: ReadonlyArray<string>): Promise<Coding[]>;
}

declare function Renderer({ questionnaire, initialResponse, onSubmit, onChange, terminologyServerUrl, }: RendererProps): JSX.Element;
export default Renderer;

declare type RendererProps = {
    questionnaire: Questionnaire;
    initialResponse?: QuestionnaireResponse | undefined;
    onChange?: ((response: QuestionnaireResponse) => void) | undefined;
    onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
    terminologyServerUrl?: string | undefined;
};

export declare class ValueSetExpander implements IValueSetExpander {
    private readonly defaultServer;
    private readonly caches;
    constructor(defaultServer?: string);
    expand(canonical: string, preferredServers: ReadonlyArray<string>): Promise<Coding[]>;
    private requestExpansion;
}

export { }
