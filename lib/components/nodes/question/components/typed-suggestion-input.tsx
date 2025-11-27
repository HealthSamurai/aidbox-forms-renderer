import "./typed-suggestion-input.css";
import "./option-status.css";
import { ReactElement, useMemo } from "react";
import type { AnswerOptionEntry, AnswerType } from "../../../../types.ts";
import type { RowRenderProps } from "../answer.tsx";

export type TypedSuggestionInputProps<T extends AnswerType> = {
  rowProps: RowRenderProps<T>;
  renderInput: (rowProps: RowRenderProps<T>) => ReactElement;
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  isLoading?: boolean;
  readOnly?: boolean;
};

export function TypedSuggestionInput<T extends AnswerType>({
  rowProps,
  renderInput,
  options,
  isLoading = false,
  readOnly = false,
}: TypedSuggestionInputProps<T>) {
  const query = normalizeValue(rowProps.value);

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
      {renderInput(rowProps)}
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
                    onClick={() =>
                      rowProps.setValue(entry.value ?? entry.label)
                    }
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
