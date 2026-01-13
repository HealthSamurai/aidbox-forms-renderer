import type { MultiSelectInputProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { LoadingSpinner } from "./loading-spinner.tsx";

function isInteractiveTarget(
  target: EventTarget | undefined,
  currentTarget: Element,
): boolean {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest(
    "input,textarea,select,button,a,[contenteditable]",
  );
  return Boolean(interactive) && interactive !== currentTarget;
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
    <Root
      className="nhsuk-input"
      ref={containerReference}
      onBlur={handleBlur}
      data-disabled={disabled ? "true" : undefined}
      aria-busy={isLoading || undefined}
    >
      {selectedOptions.map((chip) => {
        const isChipDisabled = disabled || isLoading || Boolean(chip.disabled);

        return (
          <ChipColumn key={chip.token}>
            <Chip
              type="button"
              className="nhsuk-tag"
              disabled={isChipDisabled}
              onClick={(event) => {
                if (isChipDisabled) return;
                if (isInteractiveTarget(event.target, event.currentTarget)) {
                  return;
                }
                onDeselect(chip.token);
              }}
            >
              <span className="nhsuk-u-visually-hidden">Remove </span>
              {chip.label}
              <Icon aria-hidden="true">×</Icon>
            </Chip>
            {chip.errors}
          </ChipColumn>
        );
      })}
      <Field>
        {isSearchable ? (
          <Input
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
          <Trigger
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
            {selectedOptions.length === 0 && (
              <Placeholder>{placeholder ?? "Select an option"}</Placeholder>
            )}
          </Trigger>
        )}
      </Field>
      {isLoading && (
        <Actions>
          <LoadingSpinner />
        </Actions>
      )}
      {isOpenWithCustom && (
        <Listbox
          id={listboxId}
          role="listbox"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          {customOptionForm ? (
            <CustomSlot role="presentation">{customOptionForm}</CustomSlot>
          ) : (
            <>
              {displayOptions.map((option, index) => (
                <Option
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
                </Option>
              ))}
              {specifyOtherOption && (
                <StickyOption
                  key={specifyOtherOption.token}
                  id={`${listboxId}-option-${stickyIndex}`}
                  type="button"
                  role="option"
                  aria-selected={selectedTokens.has(specifyOtherOption.token)}
                  aria-disabled={specifyOtherOption.disabled || undefined}
                  disabled={Boolean(specifyOtherOption.disabled)}
                  data-active={specifyOtherOption.token === resolvedActiveToken}
                  ref={(node) => {
                    if (node) {
                      optionReferences.current.set(
                        specifyOtherOption.token,
                        node,
                      );
                    } else {
                      optionReferences.current.delete(specifyOtherOption.token);
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
              )}
            </>
          )}
        </Listbox>
      )}
    </Root>
  );
}

const Root = styled.div`
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-border-width-form-element));
  align-items: center;
  position: relative;

  &:focus-within {
    border: var(--nhsuk-border-width-form-element) solid
      var(--nhsuk-focus-text-colour);
    outline: var(--nhsuk-focus-width) solid var(--nhsuk-focus-colour);
    outline-offset: 0;
    box-shadow: inset 0 0 0 var(--nhsuk-border-width-form-element)
      var(--nhsuk-focus-text-colour);
  }

  &[data-disabled="true"] {
    opacity: var(--nhsuk-opacity-disabled);
    color: inherit;
    background-color: transparent;
    cursor: not-allowed;
  }
`;

const ChipColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-border-width-form-element);
`;

const Chip = styled.button`
  border: none;
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: var(--nhsuk-spacing-1);

  &:disabled {
    cursor: not-allowed;
    opacity: var(--nhsuk-opacity-disabled);
  }
`;

const Icon = styled.span`
  font-weight: 700;
`;

const Field = styled.div`
  position: relative;
  flex: 1 1 calc(var(--nhsuk-spacing-9) * 2 + var(--nhsuk-spacing-5));
  min-width: calc(var(--nhsuk-spacing-9) * 2);
`;

const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;

  &::placeholder {
    opacity: var(--nhsuk-opacity-solid);
    color: var(--nhsuk-secondary-text-colour);
  }
`;

const Trigger = styled.div`
  width: 100%;
  min-height: var(--nhsuk-base-line-height);
  display: flex;
  align-items: center;
  padding: var(--nhsuk-spacing-1);
  outline: none;
  cursor: text;

  &[aria-disabled="true"] {
    cursor: not-allowed;
  }
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
`;

const Placeholder = styled.span`
  color: var(--nhsuk-secondary-text-colour);
  opacity: var(--nhsuk-opacity-solid);
`;

const Listbox = styled.div`
  position: absolute;
  top: calc(100% + var(--nhsuk-spacing-2));
  left: 0;
  right: 0;
  max-height: calc(var(--nhsuk-spacing-9) * 4);
  overflow: auto;
  border: var(--nhsuk-border-table-cell-width) solid var(--nhsuk-border-colour);
  background: var(--nhsuk-input-background-colour);
  z-index: var(--nhsuk-z-index-dropdown);
`;

const Option = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--nhsuk-spacing-2)
    calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &[data-active="true"] {
    background: var(--nhsuk-secondary-button-hover-colour);
  }

  &:hover:not(:disabled) {
    background: var(--nhsuk-secondary-button-hover-colour);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--nhsuk-opacity-disabled);
  }
`;

const StickyOption = styled(Option)`
  position: sticky;
  bottom: 0;
  background: var(--nhsuk-input-background-colour);
  border-top: var(--nhsuk-border-table-cell-width) solid
    var(--nhsuk-border-colour);
  z-index: var(--nhsuk-z-index-sticky);
`;

const CustomSlot = styled.div`
  padding: var(--nhsuk-spacing-3);
`;
