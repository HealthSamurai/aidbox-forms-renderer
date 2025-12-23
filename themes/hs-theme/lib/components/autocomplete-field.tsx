import { styled } from "@linaria/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

export type AutocompleteFieldProps<TValue> = {
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
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
  valueDisplay?: ReactNode;
};

export function AutocompleteField<TValue>({
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
  onClear,
  clearLabel,
  valueDisplay,
}: AutocompleteFieldProps<TValue>) {
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

  const [lookupOpen, setLookupOpen] = useState(false);
  const showClear = Boolean(onClear);
  const clearText = clearLabel ?? "Clear";
  const summaryContent = valueDisplay ?? (currentLabel || "Select an option");

  if (mode === "lookup") {
    return (
      <Autocomplete data-loading={isLoading ? "true" : undefined}>
        <SummaryRow aria-busy={isLoading || undefined}>
          <SummaryValue>{summaryContent}</SummaryValue>
          <SummaryActions>
            <ClearButton
              type="button"
              onClick={() => setLookupOpen(true)}
              disabled={readOnly}
            >
              Open lookup
            </ClearButton>
            {showClear ? (
              <ClearButton
                type="button"
                onClick={() => {
                  onClear?.();
                  setQuery("");
                }}
                disabled={readOnly}
              >
                {clearText}
              </ClearButton>
            ) : null}
          </SummaryActions>
        </SummaryRow>
        {lookupOpen ? (
          <Overlay role="dialog" aria-modal="true">
            <Dialog>
              <DialogTitle>Lookup options</DialogTitle>
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
                  placeholder="Search directory"
                />
                {isLoading ? <Spinner aria-hidden="true">…</Spinner> : null}
              </Field>
              {isLoading ? (
                <div
                  className={optionStatusClass}
                  role="status"
                  aria-live="polite"
                >
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
                          setLookupOpen(false);
                        }}
                      >
                        {entry.label}
                      </OptionButton>
                    </OptionItem>
                  ))}
                </Options>
              )}
              <SummaryActions>
                <ClearButton type="button" onClick={() => setLookupOpen(false)}>
                  Close
                </ClearButton>
              </SummaryActions>
            </Dialog>
          </Overlay>
        ) : null}
      </Autocomplete>
    );
  }

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
          placeholder={"Type to search"}
        />
        {isLoading ? <Spinner aria-hidden="true">…</Spinner> : null}
        {showClear && !readOnly ? (
          <ClearButton
            type="button"
            onClick={() => {
              onClear?.();
              setQuery("");
            }}
            aria-label="Clear selection"
          >
            {clearText}
          </ClearButton>
        ) : null}
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

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.25rem 0;
`;

const SummaryValue = styled.div`
  flex: 1;
  font-weight: 500;
`;

const SummaryActions = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #fff;
  color: #1a202c;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: min(90vw, 420px);
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DialogTitle = styled.div`
  font-weight: 600;
`;
