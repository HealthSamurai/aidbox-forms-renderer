import { useMemo, useState } from "react";
import type { TypedSuggestionInputProps } from "@aidbox-forms/theme";

export function TypedSuggestionInput<T>({
  renderInput,
  options,
  onSelect,
  isLoading,
  readOnly,
}: TypedSuggestionInputProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return options.slice(0, 8);
    return options
      .filter((entry) => entry.label.toLowerCase().includes(lowered))
      .slice(0, 8);
  }, [options, query]);

  return (
    <div aria-busy={isLoading || undefined}>
      <div style={{ marginBottom: "0.5rem" }}>
        {renderInput()}
        <input
          className="nhsuk-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Start typing to filter"
          disabled={readOnly}
        />
      </div>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : filtered.length > 0 ? (
        <ul className="nhsuk-list nhsuk-list--border">
          {filtered.map((option) => (
            <li key={option.key}>
              <button
                type="button"
                className="nhsuk-link"
                onClick={() => onSelect(option.value as T)}
                disabled={readOnly}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="nhsuk-hint">No matching options</div>
      )}
    </div>
  );
}
