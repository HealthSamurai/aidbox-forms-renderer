import {
  Box,
  Button,
  Combobox,
  Group,
  InputBase,
  Loader,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { MultiSelectInputProperties } from "@aidbox-forms/theme";

function joinIds(...parts: Array<string | undefined>) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value.length > 0 ? value : undefined;
}

export function MultiSelectInput({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
  placeholder,
}: MultiSelectInputProperties) {
  const [searchQuery, setSearchQuery] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearchQuery("");
      onSearch?.("");
    },
  });
  const isDisabled = disabled === true || isLoading;

  const selectedTokenSet = useMemo(() => {
    return new Set(selectedOptions.map((option) => option.token));
  }, [selectedOptions]);

  const visibleOptions = useMemo(() => {
    const available = options.filter(
      (option) => !selectedTokenSet.has(option.token),
    );
    return specifyOtherOption ? [...available, specifyOtherOption] : available;
  }, [options, selectedTokenSet, specifyOtherOption]);

  useEffect(() => {
    if (customOptionForm) {
      combobox.openDropdown();
    }
  }, [combobox, customOptionForm]);

  const describedBy = joinIds(ariaDescribedBy);
  const describedByProps =
    describedBy == undefined ? {} : { "aria-describedby": describedBy };
  const placeholderText = placeholder ?? "Select an option";

  return (
    <Stack gap="xs">
      {selectedOptions.length > 0 ? (
        <Stack gap={4}>
          {selectedOptions.map((option) => {
            const rowDescribedBy = joinIds(
              ariaDescribedBy,
              option.ariaDescribedBy,
            );
            const rowDescribedByProps =
              rowDescribedBy == undefined
                ? {}
                : { "aria-describedby": rowDescribedBy };

            const isRowDisabled = disabled === true || option.disabled === true;

            return (
              <Box key={option.token}>
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Box style={{ flex: 1, minWidth: 0 }}>{option.label}</Box>
                  <Button
                    type="button"
                    variant="subtle"
                    color="red"
                    onClick={() => onDeselect(option.token)}
                    disabled={isRowDisabled}
                    aria-label="Remove"
                    {...rowDescribedByProps}
                  >
                    Remove
                  </Button>
                </Group>
                {option.errors ?? null}
              </Box>
            );
          })}
        </Stack>
      ) : null}

      <Combobox
        store={combobox}
        onOptionSubmit={(token) => {
          if (isDisabled) return;

          onSelect(token);

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
            rightSection={
              isLoading ? <Loader size="xs" /> : <Text c="dimmed">▾</Text>
            }
            rightSectionPointerEvents="none"
          >
            <Text c="dimmed">{placeholderText}</Text>
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
                      disabled={isDisabled || option.disabled === true}
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
    </Stack>
  );
}
