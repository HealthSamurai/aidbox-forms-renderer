declare module "fuzzy-search" {
  type FuzzySearchOptions = {
    caseSensitive?: boolean;
    sort?: boolean;
  };

  export default class FuzzySearch<T = unknown> {
    constructor(
      haystack: readonly T[],
      keys?: readonly string[],
      options?: FuzzySearchOptions,
    );
    search(needle: string): T[];
  }
}
