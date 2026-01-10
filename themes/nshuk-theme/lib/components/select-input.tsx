import type { SelectInputProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { useEffect, useRef, useState, useMemo } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

export function SelectInput({
  options,
  selectedOption,
  onChange,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  placeholder,
}: SelectInputProperties) {
  const containerReference = useRef<HTMLDivElement | null>(null);
  const inputReference = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeToken, setActiveToken] = useState<string | undefined>();
  const optionReferences = useRef(
    new Map<string, HTMLButtonElement | undefined>(),
  );
  const hasCustomOptionForm = Boolean(customOptionForm);
  const isOpenWithCustom = isOpen || hasCustomOptionForm;
  const isSearchable = Boolean(onSearch);
  const showSearchInput = isSearchable && isOpenWithCustom;
  const selectedToken = selectedOption?.token ?? "";

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    onSearch?.(nextQuery);
  };

  const displayContent = selectedOption ? (
    selectedOption.label
  ) : (
    <PlaceholderText>{placeholder ?? "Select an option"}</PlaceholderText>
  );

  const listboxId = `${id}-listbox`;
  const visibleOptions = useMemo(() => {
    return specifyOtherOption ? [...options, specifyOtherOption] : options;
  }, [options, specifyOtherOption]);
  const stickyIndex = specifyOtherOption ? options.length : -1;
  const resolvedActiveToken = useMemo(() => {
    if (!isOpenWithCustom || visibleOptions.length === 0) {
      return;
    }
    const currentActive = activeToken
      ? visibleOptions.find((entry) => entry.token === activeToken)
      : undefined;
    if (currentActive && !currentActive.disabled) {
      return currentActive.token;
    }
    const selectedEntry = selectedToken
      ? visibleOptions.find((entry) => entry.token === selectedToken)
      : undefined;
    if (selectedEntry && !selectedEntry.disabled) {
      return selectedEntry.token;
    }
    const firstEnabled = visibleOptions.find((entry) => !entry.disabled);
    return firstEnabled?.token;
  }, [activeToken, isOpenWithCustom, selectedToken, visibleOptions]);
  const activeIndex = visibleOptions.findIndex(
    (entry) => entry.token === resolvedActiveToken,
  );
  const activeDescendantId =
    activeIndex === -1 ? undefined : `${listboxId}-option-${activeIndex}`;

  useEffect(() => {
    if (!isOpenWithCustom || resolvedActiveToken === undefined) return;
    const option = optionReferences.current.get(resolvedActiveToken);
    option?.scrollIntoView?.({ block: "nearest" });
  }, [isOpenWithCustom, resolvedActiveToken]);

  useEffect(() => {
    if (!isOpen) return;
    inputReference.current?.focus();
  }, [isOpen]);

  const handleSelect = (nextToken: string) => {
    if (disabled || isLoading) return;
    onChange(nextToken);
    updateQuery("");
    setIsDirty(false);
    setActiveToken(undefined);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange();
    updateQuery("");
    setIsDirty(false);
    setActiveToken(undefined);
    setIsOpen(false);
  };

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (visibleOptions.length === 0) return -1;
    const count = visibleOptions.length;
    const startPoint =
      startIndex < 0 ? (direction === 1 ? -1 : count) : startIndex;
    for (const offset of visibleOptions.keys()) {
      const nextIndex = startPoint + direction * (offset + 1);
      const wrappedIndex = ((nextIndex % count) + count) % count;
      if (!visibleOptions[wrappedIndex].disabled) {
        return wrappedIndex;
      }
    }
    return -1;
  };

  const findEdgeEnabledIndex = (direction: 1 | -1) => {
    const indices = [...visibleOptions.keys()];
    if (direction === -1) {
      indices.reverse();
    }
    for (const index of indices) {
      if (!visibleOptions[index].disabled) return index;
    }
    return -1;
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (hasCustomOptionForm) return;
    if (containerReference.current == undefined) return;
    const nextTarget = event.relatedTarget as Node | undefined;
    if (nextTarget && containerReference.current.contains(nextTarget)) {
      return;
    }
    const shouldClear =
      !disabled &&
      !isLoading &&
      isDirty &&
      query.trim().length === 0 &&
      Boolean(selectedOption);
    if (shouldClear) {
      onChange();
    }
    setActiveToken(undefined);
    setIsOpen(false);
  };

  const handleNavigationKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpenWithCustom) {
        updateQuery("");
        setIsDirty(false);
        setIsOpen(true);
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = findNextEnabledIndex(activeIndex, direction);
      if (nextIndex !== -1) {
        setActiveToken(visibleOptions[nextIndex].token);
      }
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (!isOpenWithCustom) {
        updateQuery("");
        setIsDirty(false);
        setIsOpen(true);
      }
      const direction = event.key === "Home" ? 1 : -1;
      const edgeIndex = findEdgeEnabledIndex(direction);
      if (edgeIndex !== -1) {
        setActiveToken(visibleOptions[edgeIndex].token);
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isOpenWithCustom) {
        updateQuery("");
        setIsDirty(false);
        setIsOpen(true);
        return;
      }
      if (activeIndex !== -1) {
        const entry = visibleOptions[activeIndex];
        if (!entry.disabled) {
          handleSelect(entry.token);
        }
      }
      return;
    }
    if (event.key === "Escape") {
      if (hasCustomOptionForm) return;
      setActiveToken(undefined);
      setIsOpen(false);
    }
  };

  return (
    <div
      aria-busy={isLoading || undefined}
      ref={containerReference}
      onBlur={handleBlur}
    >
      <InputRow>
        <InputWrap>
          {showSearchInput ? (
            <SelectInputField
              ref={inputReference}
              id={id}
              className="nhsuk-input"
              data-has-clear={selectedOption ? "true" : undefined}
              value={query}
              onChange={(event) => {
                updateQuery(event.target.value);
                setIsDirty(true);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (!disabled && !isLoading) {
                  updateQuery("");
                  setIsDirty(false);
                  setIsOpen(true);
                }
              }}
              onClick={() => {
                if (!disabled && !isLoading && !isOpen) {
                  updateQuery("");
                  setIsDirty(false);
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleNavigationKeyDown}
              disabled={disabled || isLoading}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpenWithCustom}
              aria-controls={listboxId}
              aria-activedescendant={
                isOpenWithCustom && activeDescendantId
                  ? activeDescendantId
                  : undefined
              }
              placeholder={placeholder ?? "Select an option"}
              autoComplete="off"
            />
          ) : (
            <SelectDisplay
              id={id}
              className="nhsuk-input"
              role="combobox"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              aria-expanded={isOpenWithCustom}
              aria-controls={listboxId}
              aria-placeholder={
                selectedOption ? undefined : (placeholder ?? "Select an option")
              }
              aria-disabled={disabled || isLoading ? true : undefined}
              tabIndex={disabled || isLoading ? -1 : 0}
              data-disabled={disabled || isLoading ? "true" : undefined}
              data-has-clear={selectedOption ? "true" : undefined}
              onClick={() => {
                if (!disabled && !isLoading && !isOpen) {
                  updateQuery("");
                  setIsDirty(false);
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleNavigationKeyDown}
            >
              {displayContent}
            </SelectDisplay>
          )}
          {selectedOption ? (
            <ClearButton
              type="button"
              onClick={handleClear}
              disabled={disabled || isLoading}
              data-disabled={disabled || isLoading ? "true" : undefined}
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Clear"
            >
              {"\u00D7"}
            </ClearButton>
          ) : undefined}
          {isOpenWithCustom ? (
            <Listbox
              id={listboxId}
              role="listbox"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
            >
              {customOptionForm ? (
                <CustomOptionSlot role="presentation">
                  {customOptionForm}
                </CustomOptionSlot>
              ) : (
                <>
                  {options.map((entry, index) => (
                    <OptionButton
                      key={entry.token}
                      id={`${listboxId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={entry.token === selectedToken}
                      aria-disabled={entry.disabled || undefined}
                      disabled={entry.disabled}
                      data-active={entry.token === resolvedActiveToken}
                      ref={(node) => {
                        if (node) {
                          optionReferences.current.set(entry.token, node);
                        } else {
                          optionReferences.current.delete(entry.token);
                        }
                      }}
                      onFocus={() => setActiveToken(entry.token)}
                      onKeyDown={handleNavigationKeyDown}
                      onClick={() => {
                        if (!entry.disabled) {
                          handleSelect(entry.token);
                        }
                      }}
                    >
                      {entry.label}
                    </OptionButton>
                  ))}
                  {specifyOtherOption ? (
                    <OptionButton
                      id={`${listboxId}-option-${stickyIndex}`}
                      type="button"
                      role="option"
                      aria-selected={specifyOtherOption.token === selectedToken}
                      aria-disabled={specifyOtherOption.disabled || undefined}
                      disabled={Boolean(specifyOtherOption.disabled)}
                      data-active={
                        specifyOtherOption.token === resolvedActiveToken
                      }
                      data-sticky="true"
                      ref={(node) => {
                        if (node) {
                          optionReferences.current.set(
                            specifyOtherOption.token,
                            node,
                          );
                        } else {
                          optionReferences.current.delete(
                            specifyOtherOption.token,
                          );
                        }
                      }}
                      onFocus={() => setActiveToken(specifyOtherOption.token)}
                      onKeyDown={handleNavigationKeyDown}
                      onClick={() => {
                        if (!specifyOtherOption.disabled) {
                          handleSelect(specifyOtherOption.token);
                        }
                      }}
                    >
                      {specifyOtherOption.label}
                    </OptionButton>
                  ) : undefined}
                </>
              )}
            </Listbox>
          ) : undefined}
        </InputWrap>
      </InputRow>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : undefined}
    </div>
  );
}

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const PlaceholderText = styled.span`
  color: #4a5568;
  opacity: 0.65;
`;

const SelectInputField = styled.input`
  &&::placeholder {
    color: #4a5568;
    opacity: 0.65;
  }

  &[data-has-clear="true"] {
    padding-right: 2rem;
  }
`;

const SelectDisplay = styled.div`
  display: flex;
  align-items: center;
  cursor: text;

  &[data-disabled="true"] {
    cursor: not-allowed;
  }

  &[data-has-clear="true"] {
    padding-right: 2rem;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0.25rem;
  cursor: pointer;
  color: #4a5568;

  &[data-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Listbox = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  max-height: 16rem;
  overflow: auto;
  border: 1px solid #d8dde0;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
  z-index: 10;
  padding: 0.25rem 0;
`;

const CustomOptionSlot = styled.div`
  padding: 0.75rem;
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &[data-active="true"] {
    background: #e8edee;
  }

  &[data-sticky="true"] {
    position: sticky;
    bottom: 0;
    border-top: 1px solid #d8dde0;
    background: #fff;
  }

  &[data-sticky="true"][data-active="true"] {
    background: #e8edee;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
