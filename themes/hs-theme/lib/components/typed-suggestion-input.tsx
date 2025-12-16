import { styled } from "@linaria/react";
import { ReactElement, useMemo } from "react";
import { optionStatusClass } from "./option-status.ts";

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
    <TypedInput>
      {renderInput()}
      {!readOnly && (
        <Suggestions>
          {isLoading ? (
            <div className={optionStatusClass} role="status" aria-live="polite">
              Loading options…
            </div>
          ) : filtered.length > 0 ? (
            <SuggestionsList>
              {filtered.map((entry) => (
                <SuggestionItem key={entry.key}>
                  <SuggestionButton
                    type="button"
                    onClick={() => onSelect(entry.value ?? entry.label)}
                  >
                    {entry.label}
                  </SuggestionButton>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          ) : options.length > 0 ? (
            <EmptyState>No matching options</EmptyState>
          ) : null}
        </Suggestions>
      )}
    </TypedInput>
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

const TypedInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Suggestions = styled.div`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background: #fff;
  max-height: 10rem;
  overflow: auto;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SuggestionItem = styled.li`
  & + & {
    border-top: 1px solid #e2e8f0;
  }
`;

const SuggestionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.375rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    background: #edf2f7;
  }
`;

const EmptyState = styled.div`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;
