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
  onClear,
  clearLabel,
  valueDisplay,
}: AutocompleteFieldProps<T>) {
  const currentLabel = useMemo(() => {
    if (legacyOptionLabel) return legacyOptionLabel;
    return options.find((entry) => entry.key === selectValue)?.label ?? "";
  }, [legacyOptionLabel, options, selectValue]);

  const [query, setQuery] = useState(currentLabel);
  const [lookupOpen, setLookupOpen] = useState(false);
  const showClear = Boolean(onClear);
  const clearText = clearLabel ?? "Clear";
  const summaryContent = valueDisplay ?? (currentLabel || "Select an option");

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

  if (mode === "lookup") {
    return (
      <div aria-busy={isLoading || undefined}>
        <div className="nhsuk-u-display-flex nhsuk-u-align-items-center nhsuk-u-gap-3">
          <div className="nhsuk-u-flex-grow-1">{summaryContent}</div>
          <button
            type="button"
            className="nhsuk-button nhsuk-button--secondary"
            onClick={() => setLookupOpen(true)}
            disabled={readOnly}
          >
            Open lookup
          </button>
          {showClear ? (
            <button
              type="button"
              className="nhsuk-button nhsuk-button--secondary"
              onClick={() => {
                onClear?.();
                setQuery("");
              }}
              disabled={readOnly}
            >
              {clearText}
            </button>
          ) : null}
        </div>
        {lookupOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            className="nhsuk-u-padding-4 nhsuk-u-margin-top-3 nhsuk-u-bg-white"
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
            }}
          >
            <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-3">
              Lookup options
            </h3>
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
                placeholder="Search directory"
              />
            </div>
            <ul className="nhsuk-list nhsuk-list--border">
              {filtered.map((entry) => (
                <li key={entry.key}>
                  <button
                    type="button"
                    className="nhsuk-link"
                    onClick={() => {
                      onSelect(entry.key);
                      setLookupOpen(false);
                    }}
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
            <div className="nhsuk-u-margin-top-3">
              <button
                type="button"
                className="nhsuk-button nhsuk-button--secondary"
                onClick={() => setLookupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

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
          placeholder="Type to search"
        />
      </div>
      {showClear && !readOnly ? (
        <button
          type="button"
          className="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-bottom-3"
          onClick={() => {
            onClear?.();
            setQuery("");
          }}
        >
          {clearText}
        </button>
      ) : null}
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
