import type { Coding, ValueSet } from "fhir/r5";
import type { IValueSetExpander } from "../stores/valueset-types.ts";

/**
 * Remote ValueSet expander that calls a FHIR terminology server's $expand operation
 */
export class RemoteValueSetExpander implements IValueSetExpander {
  constructor(private readonly baseUrl: string) {}

  async expand(canonical: string): Promise<Coding[]> {
    const url = `${this.baseUrl}/ValueSet/$expand?url=${encodeURIComponent(canonical)}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/fhir+json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to expand ValueSet: ${response.status} ${response.statusText}`,
      );
    }

    const valueSet: ValueSet = await response.json();

    if (!valueSet.expansion?.contains) {
      return [];
    }
    
    return valueSet.expansion.contains.map(
      (item): Coding => ({
        system: item.system,
        code: item.code,
        display: item.display,
        version: item.version,
      }),
    );
  }
}

/**
 * Local ValueSet expander that uses pre-expanded ValueSet resources
 */
export class LocalValueSetExpander implements IValueSetExpander {
  constructor(private readonly valueSets: Map<string, ValueSet>) {}

  async expand(canonical: string): Promise<Coding[]> {
    const valueSet = this.valueSets.get(canonical);

    if (!valueSet) {
      throw new Error(`ValueSet not found: ${canonical}`);
    }

    if (!valueSet.expansion?.contains) {
      throw new Error(
        `ValueSet ${canonical} does not have expansion. Please provide pre-expanded ValueSets.`,
      );
    }

    return valueSet.expansion.contains.map(
      (item): Coding => ({
        system: item.system,
        code: item.code,
        display: item.display,
        version: item.version,
      }),
    );
  }
}
