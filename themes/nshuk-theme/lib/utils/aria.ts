export function hasErrorId(ariaDescribedBy: string | undefined): boolean {
  if (!ariaDescribedBy) {
    return false;
  }

  return ariaDescribedBy
    .split(/\s+/)
    .filter(Boolean)
    .some((id) => id.endsWith("__errors"));
}
