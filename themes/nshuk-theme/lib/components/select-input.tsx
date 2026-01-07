import type { SelectInputProps } from "@aidbox-forms/theme";
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
}: SelectInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const optionRefs = useRef(new Map<string, HTMLButtonElement | null>());
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
    <span style={{ color: "#4a5568", opacity: 0.65 }}>
      {placeholder ?? "Select an option"}
    </span>
  );

  const listboxId = `${id}-listbox`;
  const visibleOptions = useMemo(() => {
    return specifyOtherOption ? [...options, specifyOtherOption] : options;
  }, [options, specifyOtherOption]);
  const stickyIndex = specifyOtherOption ? options.length : -1;
  const resolvedActiveToken = useMemo(() => {
    if (!isOpenWithCustom || visibleOptions.length === 0) {
      return null;
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
    return firstEnabled?.token ?? null;
  }, [activeToken, isOpenWithCustom, selectedToken, visibleOptions]);
  const activeIndex = visibleOptions.findIndex(
    (entry) => entry.token === resolvedActiveToken,
  );
  const activeDescendantId =
    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!isOpenWithCustom || !resolvedActiveToken) return;
    const option = optionRefs.current.get(resolvedActiveToken);
    option?.scrollIntoView?.({ block: "nearest" });
  }, [isOpenWithCustom, resolvedActiveToken]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  const handleSelect = (nextToken: string) => {
    if (disabled || isLoading) return;
    onChange(nextToken);
    updateQuery("");
    setIsDirty(false);
    setActiveToken(null);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    updateQuery("");
    setIsDirty(false);
    setActiveToken(null);
    setIsOpen(false);
  };

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (visibleOptions.length === 0) return -1;
    let index = startIndex;
    if (index < 0) {
      index = direction === 1 ? -1 : visibleOptions.length;
    }
    for (let i = 0; i < visibleOptions.length; i += 1) {
      index += direction;
      if (index < 0 || index >= visibleOptions.length) {
        index = direction === 1 ? 0 : visibleOptions.length - 1;
      }
      if (!visibleOptions[index].disabled) {
        return index;
      }
    }
    return -1;
  };

  const findEdgeEnabledIndex = (direction: 1 | -1) => {
    if (direction === 1) {
      for (let i = 0; i < visibleOptions.length; i += 1) {
        if (!visibleOptions[i].disabled) return i;
      }
      return -1;
    }
    for (let i = visibleOptions.length - 1; i >= 0; i -= 1) {
      if (!visibleOptions[i].disabled) return i;
    }
    return -1;
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (hasCustomOptionForm) return;
    if (!containerRef.current) return;
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && containerRef.current.contains(nextTarget)) {
      return;
    }
    if (!disabled && !isLoading && isDirty && !query.trim() && selectedOption) {
      onChange(null);
    }
    setActiveToken(null);
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
      if (nextIndex >= 0) {
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
      if (edgeIndex >= 0) {
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
      if (activeIndex >= 0) {
        const entry = visibleOptions[activeIndex];
        if (!entry.disabled) {
          handleSelect(entry.token);
        }
      }
      return;
    }
    if (event.key === "Escape") {
      if (hasCustomOptionForm) return;
      setActiveToken(null);
      setIsOpen(false);
    }
  };

  return (
    <div
      aria-busy={isLoading || undefined}
      ref={containerRef}
      onBlur={handleBlur}
    >
      <div className="nhsuk-u-display-flex nhsuk-u-align-items-center">
        <div style={{ position: "relative", flex: 1 }}>
          {showSearchInput ? (
            <SelectInputField
              ref={inputRef}
              id={id}
              className="nhsuk-input"
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
              style={{ paddingRight: selectedOption ? "2rem" : undefined }}
            />
          ) : (
            <div
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
              onClick={() => {
                if (!disabled && !isLoading && !isOpen) {
                  updateQuery("");
                  setIsDirty(false);
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleNavigationKeyDown}
              style={{
                paddingRight: selectedOption ? "2rem" : undefined,
                display: "flex",
                alignItems: "center",
                cursor: disabled || isLoading ? "not-allowed" : "text",
              }}
            >
              {displayContent}
            </div>
          )}
          {selectedOption ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || isLoading}
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Clear"
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                padding: "0.25rem",
                cursor: "pointer",
                color: "#4a5568",
                opacity: disabled || isLoading ? 0.6 : 1,
              }}
            >
              {"\u00d7"}
            </button>
          ) : null}
          {isOpenWithCustom ? (
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              style={{
                position: "absolute",
                top: "calc(100% + 0.25rem)",
                left: 0,
                right: 0,
                maxHeight: "16rem",
                overflow: "auto",
                border: "1px solid #d8dde0",
                borderRadius: "4px",
                background: "#fff",
                boxShadow: "0 8px 16px rgba(15, 23, 42, 0.08)",
                zIndex: 10,
                padding: "0.25rem 0",
              }}
            >
              {customOptionForm ? (
                <div style={{ padding: "0.75rem" }} role="presentation">
                  {customOptionForm}
                </div>
              ) : (
                <>
                  {options.map((entry, index) => (
                    <button
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
                          optionRefs.current.set(entry.token, node);
                        } else {
                          optionRefs.current.delete(entry.token);
                        }
                      }}
                      onFocus={() => setActiveToken(entry.token)}
                      onKeyDown={handleNavigationKeyDown}
                      onClick={() => {
                        if (!entry.disabled) {
                          handleSelect(entry.token);
                        }
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                        border: "none",
                        background:
                          entry.token === resolvedActiveToken
                            ? "#e8edee"
                            : "transparent",
                        cursor: entry.disabled ? "not-allowed" : "pointer",
                        font: "inherit",
                        color: "inherit",
                        opacity: entry.disabled ? 0.6 : 1,
                      }}
                    >
                      {entry.label}
                    </button>
                  ))}
                  {specifyOtherOption ? (
                    <button
                      id={`${listboxId}-option-${stickyIndex}`}
                      type="button"
                      role="option"
                      aria-selected={specifyOtherOption.token === selectedToken}
                      aria-disabled={specifyOtherOption.disabled || undefined}
                      disabled={Boolean(specifyOtherOption.disabled)}
                      data-active={
                        specifyOtherOption.token === resolvedActiveToken
                      }
                      ref={(node) => {
                        if (node) {
                          optionRefs.current.set(
                            specifyOtherOption.token,
                            node,
                          );
                        } else {
                          optionRefs.current.delete(specifyOtherOption.token);
                        }
                      }}
                      onFocus={() => setActiveToken(specifyOtherOption.token)}
                      onKeyDown={handleNavigationKeyDown}
                      onClick={() => {
                        if (!specifyOtherOption.disabled) {
                          handleSelect(specifyOtherOption.token);
                        }
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.5rem 0.75rem",
                        border: "none",
                        background:
                          specifyOtherOption.token === resolvedActiveToken
                            ? "#e8edee"
                            : "#fff",
                        borderTop: "1px solid #d8dde0",
                        position: "sticky",
                        bottom: 0,
                        cursor: specifyOtherOption.disabled
                          ? "not-allowed"
                          : "pointer",
                        font: "inherit",
                        color: "inherit",
                        opacity: specifyOtherOption.disabled ? 0.6 : 1,
                      }}
                    >
                      {specifyOtherOption.label}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}

const SelectInputField = styled.input`
  &&::placeholder {
    color: #4a5568;
    opacity: 0.65;
  }
`;
