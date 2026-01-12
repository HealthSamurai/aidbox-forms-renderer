import {
  ActionIcon,
  Box,
  Combobox,
  Group,
  InputBase,
  Loader,
  Text,
  useCombobox,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { SelectInputProperties } from "@aidbox-forms/theme";

function joinIds(...parts: Array<string | undefined>) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value.length > 0 ? value : undefined;
}

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
  disabled,
  isLoading = false,
  placeholder,
}: SelectInputProperties) {
  const [searchQuery, setSearchQuery] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearchQuery("");
      onSearch?.("");
    },
  });
  const isDisabled = disabled === true || isLoading;

  const visibleOptions = useMemo(() => {
    return specifyOtherOption ? [...options, specifyOtherOption] : options;
  }, [options, specifyOtherOption]);

  useEffect(() => {
    if (customOptionForm) {
      combobox.openDropdown();
    }
  }, [combobox, customOptionForm]);

  const describedBy = joinIds(ariaDescribedBy);
  const describedByProps =
    describedBy == undefined ? {} : { "aria-describedby": describedBy };
  const placeholderText = placeholder ?? "Select an option";

  const rightSection = isLoading ? (
    <Loader size="xs" />
  ) : selectedOption ? (
    <ActionIcon
      size="sm"
      variant="subtle"
      aria-label="Clear selection"
      onClick={(event) => {
        event.stopPropagation();
        onChange();
        combobox.closeDropdown();
      }}
      disabled={isDisabled}
    >
      ×
    </ActionIcon>
  ) : (
    <Text c="dimmed">▾</Text>
  );

  return (
    <Box>
      <Combobox
        store={combobox}
        onOptionSubmit={(token) => {
          if (isDisabled) return;

          onChange(token);

          if (token !== specifyOtherOption?.token) {
            combobox.closeDropdown();
          }
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            id={id}
            onClick={() => {
              if (!isDisabled) {
                combobox.toggleDropdown();
                onSearch?.(searchQuery);
              }
            }}
            disabled={isDisabled}
            aria-labelledby={ariaLabelledBy}
            {...describedByProps}
            rightSection={rightSection}
            rightSectionPointerEvents={isLoading ? "none" : "auto"}
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <Text c="dimmed">{placeholderText}</Text>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          {customOptionForm ? (
            <Box p="sm">{customOptionForm}</Box>
          ) : (
            <>
              {onSearch ? (
                <Combobox.Search
                  value={searchQuery}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const next = event.currentTarget.value;
                    setSearchQuery(next);
                    onSearch(next);
                    combobox.openDropdown();
                  }}
                  placeholder="Search"
                />
              ) : null}

              <Combobox.Options>
                {visibleOptions.length === 0 ? (
                  <Combobox.Empty>No options</Combobox.Empty>
                ) : (
                  visibleOptions.map((option) => (
                    <Combobox.Option
                      key={option.token}
                      value={option.token}
                      disabled={
                        isDisabled ||
                        option.disabled === true ||
                        option.token === ""
                      }
                    >
                      <Group gap={8} wrap="nowrap">
                        {option.label}
                      </Group>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </>
          )}
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}
