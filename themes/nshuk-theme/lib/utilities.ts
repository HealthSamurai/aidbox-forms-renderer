export function interpose<T, S>(array: T[], separator: S): Array<T | S> {
  if (array.length <= 1) return [...array];

  const result: Array<T | S> = [];
  for (const [index, element] of array.entries()) {
    if (index > 0) result.push(separator);
    result.push(element);
  }
  return result;
}
