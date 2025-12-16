import { styled } from "@linaria/react";
import { useEffect, useMemo, useState } from "react";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

export type OptionAutocompleteFieldProps<TValue> = {
  options: ReadonlyArray<{ key: string; label: string; value: TValue }>;
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

export function OptionAutocompleteField<TValue>({
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
}: OptionAutocompleteFieldProps<TValue>) {
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
    <Autocomplete data-loading={isLoading ? "true" : undefined}>
      <Field aria-busy={isLoading || undefined}>
        <SearchInput
          id={inputId}
          className={inputClass}
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
        {isLoading ? <Spinner aria-hidden="true">…</Spinner> : null}
        {query && !readOnly && (
          <ClearButton
            type="button"
            onClick={() => onSelect("")}
            aria-label="Clear selection"
          >
            Clear
          </ClearButton>
        )}
      </Field>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      {!readOnly && !isLoading && filtered.length > 0 && (
        <Options>
          {filtered.map((entry) => (
            <OptionItem key={entry.key}>
              <OptionButton
                type="button"
                onClick={() => {
                  onSelect(entry.key);
                }}
              >
                {entry.label}
              </OptionButton>
            </OptionItem>
          ))}
        </Options>
      )}
    </Autocomplete>
  );
}

const Autocomplete = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Field = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
`;

const Spinner = styled.div`
  font-size: 1.25rem;
  line-height: 1;
  color: #4a5568;
`;

const ClearButton = styled.button`
  border: none;
  background: #edf2f7;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
`;

const Options = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  max-height: 12rem;
  overflow: auto;
`;

const OptionItem = styled.li`
  & + & {
    border-top: 1px solid #e2e8f0;
  }
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    background: #edf2f7;
  }
`;
