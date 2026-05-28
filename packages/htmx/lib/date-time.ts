export function dateTimeLocalInputValue(value: string): string {
  const match =
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2})(\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/u.exec(
      value,
    );
  if (!match) {
    return value;
  }

  const seconds = match[2];
  const fraction = match[3] ?? "";
  return seconds === undefined || (seconds === "00" && fraction.length === 0)
    ? match[1]
    : `${match[1]}:${seconds}${fraction}`;
}

export function isDateTimeLocalInputValue(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/u.test(value);
}
