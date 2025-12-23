import { useEffect, useMemo, useState } from "react";
import type { AutocompleteFieldProps } from "@aidbox-forms/theme";

export function AutocompleteField<T>({
  options,
  selectValue,
  legacyOptionLabel,
  onSelect,
  inputId,
  labelId,
  describedById,
  readOnly,
  mode,
  isLoading,
}: AutocompleteFieldProps<T>) {
  const currentLabel = useMemo(() => {
    if (legacyOptionLabel) return legacyOptionLabel;
    return options.find((entry) => entry.key === selectValue)?.label ?? "";
  }, [legacyOptionLabel, options, selectValue]);

  const [query, setQuery] = useState(currentLabel);

  useEffect(() => {
    setQuery(currentLabel);
  }, [currentLabel]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return options;
    return options.filter((entry) =>
      entry.label.toLowerCase().includes(lowered),
    );
  }, [options, query]);

  return (
    <div aria-busy={isLoading || undefined}>
      <div className="nhsuk-form-group">
        <input
          id={inputId}
          className="nhsuk-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-labelledby={labelId}
          aria-describedby={describedById}
          disabled={readOnly}
          placeholder={
            mode === "lookup" ? "Search directory" : "Type to search"
          }
        />
      </div>
      <ul className="nhsuk-list nhsuk-list--border">
        {filtered.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              className="nhsuk-link"
              onClick={() => onSelect(entry.key)}
              disabled={readOnly}
            >
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
