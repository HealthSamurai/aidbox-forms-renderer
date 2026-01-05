import type { MultiSelectInputProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest("input,textarea,select,button,a,[contenteditable]"),
  );
}

export function MultiSelectInput({
  options,
  onSelect,
  onDeselect,
  onSearch,
  id,
  customOption,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  selectedOptions,
  customOptionForm,
  placeholder,
}: MultiSelectInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const optionRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const hasCustomOptionForm = Boolean(customOptionForm);
  const isOpenWithCustom = isOpen || hasCustomOptionForm;
  const isSearchable = Boolean(onSearch);
  const selectedTokens = useMemo(
    () => new Set(selectedOptions.map((option) => option.token)),
    [selectedOptions],
  );

  const listboxId = `${id}-listbox`;
  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    onSearch?.(nextQuery);
  };
  const visibleOptions = useMemo(() => {
    return customOption ? [...options, customOption] : options;
  }, [customOption, options]);
  const stickyIndex = customOption ? options.length : -1;
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
    const firstEnabled = visibleOptions.find((entry) => !entry.disabled);
    return firstEnabled?.token ?? null;
  }, [activeToken, isOpenWithCustom, visibleOptions]);
  const activeIndex = visibleOptions.findIndex(
    (entry) => entry.token === resolvedActiveToken,
  );
  const activeDescendantId =
    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    if (!isOpenWithCustom || !resolvedActiveToken) return;
    const option = optionRefs.current.get(resolvedActiveToken);
    option?.scrollIntoView?.({ block: "nearest" });
  }, [resolvedActiveToken, isOpenWithCustom]);

  const handleSelect = (nextToken: string) => {
    if (!nextToken || disabled || isLoading) return;
    onSelect(nextToken);
    updateQuery("");
    setActiveToken(null);
    setIsOpen(false);
  };
  const openOptions = () => {
    if (disabled || isLoading) return;
    setIsOpen(true);
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
    updateQuery("");
    setActiveToken(null);
    setIsOpen(false);
  };

  const handleNavigationKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpenWithCustom) {
        openOptions();
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
        openOptions();
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
        openOptions();
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
      updateQuery("");
      setActiveToken(null);
      setIsOpen(false);
    }
  };

  return (
    <FormGroup className="nhsuk-form-group" aria-busy={isLoading || undefined}>
      <SelectField
        ref={containerRef}
        onBlur={handleBlur}
        data-disabled={disabled ? "true" : undefined}
      >
        {selectedOptions.map((chip) => {
          const isChipDisabled = disabled || Boolean(chip.disabled);
          return (
            <ChipColumn key={chip.token}>
              <Chip
                role="button"
                tabIndex={isChipDisabled ? undefined : 0}
                aria-label="Remove"
                aria-disabled={isChipDisabled ? true : undefined}
                data-clickable="true"
                data-disabled={isChipDisabled ? "true" : undefined}
                onClick={(event) => {
                  if (isChipDisabled) return;
                  if (isInteractiveTarget(event.target)) return;
                  onDeselect(chip.token);
                }}
                onKeyDown={(event) => {
                  if (isChipDisabled) return;
                  if (event.currentTarget !== event.target) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onDeselect(chip.token);
                  }
                }}
              >
                {chip.label}
              </Chip>
              {chip.errors}
            </ChipColumn>
          );
        })}
        <SelectWrapper>
          {isSearchable ? (
            <SelectInputField
              id={id}
              className="nhsuk-input"
              value={query}
              onChange={(event) => {
                updateQuery(event.target.value);
                openOptions();
              }}
              onFocus={() => {
                openOptions();
              }}
              onClick={() => {
                openOptions();
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
            <SelectTrigger
              id={id}
              role="combobox"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              aria-busy={isLoading || undefined}
              aria-expanded={isOpenWithCustom}
              aria-controls={listboxId}
              aria-activedescendant={
                isOpenWithCustom && activeDescendantId
                  ? activeDescendantId
                  : undefined
              }
              aria-disabled={disabled || isLoading ? true : undefined}
              tabIndex={disabled || isLoading ? -1 : 0}
              onFocus={openOptions}
              onClick={openOptions}
              onKeyDown={handleNavigationKeyDown}
            >
              {selectedOptions.length === 0 ? (
                <PlaceholderText>
                  {placeholder ?? "Select an option"}
                </PlaceholderText>
              ) : null}
            </SelectTrigger>
          )}
        </SelectWrapper>
        {isOpenWithCustom ? (
          <DropdownPanel
            id={listboxId}
            role="listbox"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          >
            {customOptionForm ? (
              <CustomOptionContent role="presentation">
                {customOptionForm}
              </CustomOptionContent>
            ) : (
              <>
                {options.map((option, index) => (
                  <OptionButton
                    key={option.token}
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={selectedTokens.has(option.token)}
                    aria-disabled={option.disabled || undefined}
                    disabled={Boolean(option.disabled)}
                    data-active={option.token === resolvedActiveToken}
                    ref={(node) => {
                      if (node) {
                        optionRefs.current.set(option.token, node);
                      } else {
                        optionRefs.current.delete(option.token);
                      }
                    }}
                    onFocus={() => setActiveToken(option.token)}
                    onKeyDown={handleNavigationKeyDown}
                    onClick={() => {
                      if (!option.disabled) {
                        handleSelect(option.token);
                      }
                    }}
                  >
                    {option.label}
                  </OptionButton>
                ))}
                {customOption ? (
                  <StickyOption
                    key={customOption.token}
                    id={`${listboxId}-option-${stickyIndex}`}
                    type="button"
                    role="option"
                    aria-selected={selectedTokens.has(customOption.token)}
                    aria-disabled={customOption.disabled || undefined}
                    disabled={Boolean(customOption.disabled)}
                    data-active={customOption.token === resolvedActiveToken}
                    ref={(node) => {
                      if (node) {
                        optionRefs.current.set(customOption.token, node);
                      } else {
                        optionRefs.current.delete(customOption.token);
                      }
                    }}
                    onFocus={() => setActiveToken(customOption.token)}
                    onKeyDown={handleNavigationKeyDown}
                    onClick={() => {
                      if (!customOption.disabled) {
                        handleSelect(customOption.token);
                      }
                    }}
                  >
                    {customOption.label}
                  </StickyOption>
                ) : null}
              </>
            )}
          </DropdownPanel>
        ) : null}
      </SelectField>
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </FormGroup>
  );
}

const FormGroup = styled.div``;

const SelectField = styled.div`
  border: 1px solid #d8dde0;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  background: transparent;
  position: relative;

  &[data-disabled="true"] {
    background: #f0f4f5;
  }

  &:focus-within {
    border-color: #005eb8;
    box-shadow: 0 0 0 2px rgba(0, 94, 184, 0.35);
  }
`;

const ChipColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const Chip = styled.div`
  border: 1px solid #d8dde0;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
  background: #fff;

  &[data-clickable="true"] {
    cursor: pointer;
  }

  &[data-clickable="true"]:hover {
    background: #f0f4f5;
  }

  &[data-clickable="true"][data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &[data-clickable="true"][data-disabled="true"]:hover {
    background: #fff;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  flex: 1 1 10rem;
  min-width: 8rem;
`;

const SelectInputField = styled.input`
  && {
    border: none;
    padding: 0.25rem 0.25rem;
    width: 100%;
    background: transparent;
    outline: none;
  }

  &::placeholder {
    color: #4a5568;
    opacity: 0.65;
  }
`;

const SelectTrigger = styled.div`
  width: 100%;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.25rem;
  outline: none;
  cursor: text;

  &[aria-disabled="true"] {
    cursor: not-allowed;
  }
`;

const PlaceholderText = styled.span`
  color: #4a5568;
  opacity: 0.65;
`;

const DropdownPanel = styled.div`
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

  &:hover:not(:disabled) {
    background: #e8edee;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StickyOption = styled(OptionButton)`
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #d8dde0;
  z-index: 1;
`;

const CustomOptionContent = styled.div`
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #d8dde0;
  background: #fff;
`;
