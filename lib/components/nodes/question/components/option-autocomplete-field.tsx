import "./option-autocomplete-field.css";
import "./option-status.css";
import "../../../controls/text-input.css";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import type { AnswerType, AnswerOptionEntry } from "../../../../types.ts";

export type OptionAutocompleteFieldProps<T extends AnswerType> = {
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  selectValue: string;
  legacyOptionLabel: string | undefined;
  onSelect: (key: string) => void;
  inputId: string;
  labelId: string;
  describedById?: string | undefined;
  readOnly: boolean;
  mode: "autocomplete" | "lookup";
  isLoading?: boolean;
};

export function OptionAutocompleteField<T extends AnswerType>({
  options,
  selectValue,
  legacyOptionLabel,
  onSelect,
  inputId,
  labelId,
  describedById,
  readOnly,
  mode,
  isLoading = false,
}: OptionAutocompleteFieldProps<T>) {
  const currentLabel = useMemo(() => {
    if (legacyOptionLabel) {
      return legacyOptionLabel;
    }
    return options.find((entry) => entry.key === selectValue)?.label ?? "";
  }, [legacyOptionLabel, options, selectValue]);

  const [query, setQuery] = useState(currentLabel);

  useEffect(() => {
    setQuery(currentLabel);
  }, [currentLabel]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) {
      return options;
    }
    return options.filter((entry) =>
      entry.label.toLowerCase().includes(lowered),
    );
  }, [options, query]);

  return (
    <div
      className={classNames(
        "af-option-autocomplete",
        `af-option-autocomplete--${mode}`,
        "af-autocomplete",
      )}
      data-loading={isLoading ? "true" : undefined}
    >
      <div
        className="af-option-autocomplete__field"
        aria-busy={isLoading || undefined}
      >
        <input
          id={inputId}
          className="af-input"
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
        {isLoading ? (
          <div className="af-option-autocomplete__spinner" aria-hidden="true">
            …
          </div>
        ) : null}
        {query && !readOnly && (
          <button
            type="button"
            onClick={() => onSelect("")}
            aria-label="Clear selection"
          >
            Clear
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {!readOnly && !isLoading && filtered.length > 0 && (
        <ul className="af-option-autocomplete__options">
          {filtered.map((entry) => (
            <li key={entry.key}>
              <button
                type="button"
                onClick={() => {
                  onSelect(entry.key);
                }}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
