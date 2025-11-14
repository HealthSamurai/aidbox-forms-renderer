import type { Coding } from "fhir/r5";

/**
 * Interface for ValueSet expansion service
 * Implementations can provide local or remote ValueSet expansion
 */
export interface IValueSetExpander {
  /**
   * Expand a ValueSet by its canonical URL
   * @param canonical - The canonical URL of the ValueSet (e.g., "http://hl7.org/fhir/ValueSet/administrative-gender")
   * @returns Promise resolving to array of Coding objects
   */
  expand(canonical: string): Promise<Coding[]>;
}

/**
 * State of ValueSet expansion operation
 */
export type ValueSetExpansionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; codings: Coding[] }
  | { status: "error"; error: string };
