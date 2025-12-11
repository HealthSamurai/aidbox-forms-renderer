import "./typed-suggestion-input.css";
import "./option-status.css";
import { ReactElement, useMemo } from "react";

export type TypedSuggestionInputProps<TValue> = {
  renderInput: () => ReactElement;
  options: ReadonlyArray<{ key: string; label: string; value: TValue }>;
  isLoading?: boolean;
  readOnly?: boolean;
  onSelect: (value: TValue | string) => void;
  currentValue: unknown;
};

export function TypedSuggestionInput<TValue>({
  renderInput,
  options,
  isLoading = false,
  readOnly = false,
  onSelect,
  currentValue,
}: TypedSuggestionInputProps<TValue>) {
  const query = normalizeValue(currentValue);

  const filtered = useMemo(() => {
    if (!options.length) return [];
    const lowered = query.toLowerCase();
    if (!lowered) {
      return options.slice(0, 8);
    }
    return options
      .filter((entry) => entry.label.toLowerCase().includes(lowered))
      .slice(0, 8);
  }, [options, query]);

  return (
    <div className="af-typed-input">
      {renderInput()}
      {!readOnly && (
        <div className="af-typed-input__suggestions">
          {isLoading ? (
            <div className="af-option-status" role="status" aria-live="polite">
              Loading options…
            </div>
          ) : filtered.length > 0 ? (
            <ul>
              {filtered.map((entry) => (
                <li key={entry.key}>
                  <button
                    type="button"
                    onClick={() => onSelect(entry.value ?? entry.label)}
                  >
                    {entry.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : options.length > 0 ? (
            <div className="af-typed-input__empty">No matching options</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function normalizeValue(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return "";
}
