import type { SelectInputProperties } from "@aidbox-forms/theme";
import type { SelectOption } from "@opentui/core";
import { useMemo, useState } from "react";
import { useFocusable } from "./focus-provider.tsx";
import { InlineText, toPlainText } from "./utilities.tsx";

export function SelectInput({
  options,
  selectedOption,
  onChange,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  disabled,
  isLoading = false,
  placeholder,
}: SelectInputProperties) {
  const enabled = disabled !== true && !isLoading;
  const selectFocused = useFocusable(id, enabled).focused;

  const searchId = `${id}-search`;
  const searchFocusable = useFocusable(
    searchId,
    enabled && onSearch != undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fullOptions = useMemo(() => {
    const base = specifyOtherOption
      ? [...options, specifyOtherOption]
      : [...options];
    const tokens = new Set(base.map((option) => option.token));

    const activeToken =
      customOptionForm && specifyOtherOption
        ? specifyOtherOption.token
        : selectedOption?.token;

    if (activeToken && !tokens.has(activeToken)) {
      base.unshift({
        token: activeToken,
        label: selectedOption?.label ?? activeToken,
        disabled: true,
      });
    }

    return base;
  }, [customOptionForm, options, selectedOption, specifyOtherOption]);

  const activeToken =
    customOptionForm && specifyOtherOption
      ? specifyOtherOption.token
      : selectedOption?.token;

  const selectedIndex =
    activeToken == undefined
      ? 0
      : 1 + fullOptions.findIndex((option) => option.token === activeToken);

  const selectOptions = useMemo<SelectOption[]>(() => {
    const placeholderText = placeholder ?? "Select an option";
    const none: SelectOption = {
      name: placeholderText,
      description: "",
      value: undefined,
    };

    return [
      none,
      ...fullOptions.map((option) => ({
        name: toPlainText(option.label) || option.token,
        description: option.disabled === true ? "(disabled)" : "",
        value: option.token,
      })),
    ];
  }, [fullOptions, placeholder]);

  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      {onSearch ? (
        <box
          style={{ border: true, height: 3, paddingLeft: 1, paddingRight: 1 }}
        >
          <input
            value={searchQuery}
            placeholder="Search"
            focused={searchFocusable.focused}
            onInput={(next) => {
              setSearchQuery(next);
              if (!enabled) return;
              onSearch(next);
            }}
            onSubmit={() => {
              if (!enabled) return;
              searchFocusable.focusNext();
            }}
          />
        </box>
      ) : undefined}

      <box
        style={{ border: true, height: 10, paddingLeft: 1, paddingRight: 1 }}
      >
        <select
          options={selectOptions}
          selectedIndex={Math.max(0, selectedIndex)}
          showDescription
          showScrollIndicator
          wrapSelection
          focused={selectFocused}
          onSelect={(_, option) => {
            if (!enabled) return;

            const token =
              typeof option?.value === "string"
                ? (option.value as string)
                : undefined;

            if (token == undefined) {
              onChange();
              return;
            }

            const matched = fullOptions.find((entry) => entry.token === token);
            if (matched?.disabled === true) return;

            onChange(token);
          }}
        />
      </box>

      {isLoading ? <InlineText dim>Loading…</InlineText> : undefined}
      {customOptionForm}
      {selectedOption?.errors}
    </box>
  );
}
