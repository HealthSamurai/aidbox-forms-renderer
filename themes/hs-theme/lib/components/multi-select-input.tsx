import { styled } from "@linaria/react";
import type { MultiSelectInputProperties } from "@aidbox-forms/theme";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { optionStatusClass } from "./option-status.ts";

function isInteractiveTarget(target: EventTarget | undefined): boolean {
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
  specifyOtherOption,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  selectedOptions,
  customOptionForm,
  placeholder,
}: MultiSelectInputProperties) {
  const containerReference = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeToken, setActiveToken] = useState<string | undefined>();
  const optionReferences = useRef(
    new Map<string, HTMLButtonElement | undefined>(),
  );
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
  const displayOptions = useMemo(() => {
    return options.filter((option) => !selectedTokens.has(option.token));
  }, [options, selectedTokens]);
  const visibleOptions = useMemo(() => {
    return specifyOtherOption
      ? [...displayOptions, specifyOtherOption]
      : displayOptions;
  }, [displayOptions, specifyOtherOption]);
  const stickyIndex = specifyOtherOption ? displayOptions.length : -1;
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
    const firstEnabled = visibleOptions.find((entry) => !entry.disabled);
    return firstEnabled?.token;
  }, [activeToken, isOpenWithCustom, visibleOptions]);
  const activeIndex = visibleOptions.findIndex(
    (entry) => entry.token === resolvedActiveToken,
  );
  const activeDescendantId =
    activeIndex === -1 ? undefined : `${listboxId}-option-${activeIndex}`;

  useEffect(() => {
    if (!isOpenWithCustom || resolvedActiveToken === undefined) return;
    const option = optionReferences.current.get(resolvedActiveToken);
    option?.scrollIntoView?.({ block: "nearest" });
  }, [resolvedActiveToken, isOpenWithCustom]);

  const handleSelect = (nextToken: string) => {
    if (nextToken.length === 0 || disabled || isLoading) return;
    onSelect(nextToken);
    updateQuery("");
    setActiveToken(undefined);
    setIsOpen(false);
  };
  const openOptions = () => {
    if (disabled || isLoading) return;
    setIsOpen(true);
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
    if (!containerReference.current) return;
    const nextTarget = event.relatedTarget as Node | undefined;
    if (nextTarget && containerReference.current.contains(nextTarget)) {
      return;
    }
    updateQuery("");
    setActiveToken(undefined);
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
      if (nextIndex !== -1) {
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
      if (edgeIndex !== -1) {
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
      updateQuery("");
      setActiveToken(undefined);
      setIsOpen(false);
    }
  };

  return (
    <Stack>
      <SelectField
        ref={containerReference}
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
                <ChipContent>{chip.label}</ChipContent>
              </Chip>
              {chip.errors}
            </ChipColumn>
          );
        })}
        <SelectWrapper>
          {isSearchable ? (
            <SelectInputField
              id={id}
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
              aria-busy={isLoading || undefined}
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
              ) : undefined}
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
                {displayOptions.map((option, index) => (
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
                        optionReferences.current.set(option.token, node);
                      } else {
                        optionReferences.current.delete(option.token);
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
                {specifyOtherOption ? (
                  <StickyOption
                    key={specifyOtherOption.token}
                    id={`${listboxId}-option-${stickyIndex}`}
                    type="button"
                    role="option"
                    aria-selected={selectedTokens.has(specifyOtherOption.token)}
                    aria-disabled={specifyOtherOption.disabled || undefined}
                    disabled={Boolean(specifyOtherOption.disabled)}
                    data-active={
                      specifyOtherOption.token === resolvedActiveToken
                    }
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
                  </StickyOption>
                ) : undefined}
              </>
            )}
          </DropdownPanel>
        ) : undefined}
      </SelectField>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : undefined}
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SelectField = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  position: relative;

  &[data-disabled="true"] {
    background: #edf2f7;
  }

  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  flex: 1 1 10rem;
  min-width: 8rem;
`;

const SelectInputField = styled.input`
  width: 100%;
  border: none;
  padding: 0.25rem 0.25rem;
  font: inherit;
  background: transparent;
  outline: none;

  &::placeholder {
    color: #a0aec0;
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
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
  color: #a0aec0;
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  max-height: 16rem;
  overflow: auto;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background: #fff;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const OptionButton = styled.button`
  border: none;
  background: transparent;
  text-align: left;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &[data-active="true"] {
    background: #e2e8f0;
  }

  &:hover:not(:disabled) {
    background: #edf2f7;
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
  border-top: 1px solid #e2e8f0;
  z-index: 1;
`;

const ChipColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 9999px;
  background: #f7fafc;

  &[data-clickable="true"] {
    cursor: pointer;
  }

  &[data-clickable="true"]:hover {
    background: #edf2f7;
  }

  &[data-clickable="true"][data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &[data-clickable="true"][data-disabled="true"]:hover {
    background: #f7fafc;
  }
`;

const ChipContent = styled.div`
  display: inline-flex;
  align-items: center;
`;

const CustomOptionContent = styled.div`
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
`;
