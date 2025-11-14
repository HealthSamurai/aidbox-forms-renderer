import type { Coding } from "fhir/r5";
import type { IValueSetExpander } from "../stores/valueset-types.ts";

/**
 * Caching wrapper for ValueSet expander
 * Caches expansion results to avoid redundant terminology server calls
 */
export class CachedValueSetExpander implements IValueSetExpander {
  private cache = new Map<string, Promise<Coding[]>>();

  constructor(private readonly delegate: IValueSetExpander) {}

  async expand(canonical: string): Promise<Coding[]> {
    // Check if expansion is already in progress or cached
    let promise = this.cache.get(canonical);

    if (!promise) {
      // Start new expansion and cache the promise
      promise = this.delegate
        .expand(canonical)
        .catch((error) => {
          // Remove from cache on error so it can be retried
          this.cache.delete(canonical);
          throw error;
        });

      this.cache.set(canonical, promise);
    }

    return promise;
  }

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific ValueSet
   */
  clearCacheFor(canonical: string): void {
    this.cache.delete(canonical);
  }
}
