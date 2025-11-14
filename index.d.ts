import { Coding } from 'fhir/r5';
import { JSX } from 'react/jsx-runtime';
import { Questionnaire } from 'fhir/r5';
import { QuestionnaireResponse } from 'fhir/r5';
import { ValueSet } from 'fhir/r5';

/**
 * Caching wrapper for ValueSet expander
 * Caches expansion results to avoid redundant terminology server calls
 */
export declare class CachedValueSetExpander implements IValueSetExpander {
    private readonly delegate;
    private cache;
    constructor(delegate: IValueSetExpander);
    expand(canonical: string): Promise<Coding[]>;
    /**
     * Clear the entire cache
     */
    clearCache(): void;
    /**
     * Clear cache for specific ValueSet
     */
    clearCacheFor(canonical: string): void;
}

/**
 * Interface for ValueSet expansion service
 * Implementations can provide local or remote ValueSet expansion
 */
export declare interface IValueSetExpander {
    /**
     * Expand a ValueSet by its canonical URL
     * @param canonical - The canonical URL of the ValueSet (e.g., "http://hl7.org/fhir/ValueSet/administrative-gender")
     * @returns Promise resolving to array of Coding objects
     */
    expand(canonical: string): Promise<Coding[]>;
}

/**
 * Local ValueSet expander that uses pre-expanded ValueSet resources
 */
export declare class LocalValueSetExpander implements IValueSetExpander {
    private readonly valueSets;
    constructor(valueSets: Map<string, ValueSet>);
    expand(canonical: string): Promise<Coding[]>;
}

/**
 * Remote ValueSet expander that calls a FHIR terminology server's $expand operation
 */
export declare class RemoteValueSetExpander implements IValueSetExpander {
    private readonly baseUrl;
    constructor(baseUrl: string);
    expand(canonical: string): Promise<Coding[]>;
}

declare function Renderer({ questionnaire, initialResponse, onSubmit, onChange, terminologyService, }: RendererProps): JSX.Element;
export default Renderer;

declare type RendererProps = {
    questionnaire: Questionnaire;
    initialResponse?: QuestionnaireResponse | undefined;
    onChange?: ((response: QuestionnaireResponse) => void) | undefined;
    onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
    terminologyService?: IValueSetExpander | undefined;
};

export { }
