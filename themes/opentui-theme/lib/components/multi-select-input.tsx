import type { MultiSelectInputProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";
import { Checkbox } from "./checkbox.tsx";
import { useFocusable } from "./focus-provider.tsx";
import { useState } from "react";

export function MultiSelectInput({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  disabled,
  isLoading = false,
  placeholder,
}: MultiSelectInputProperties) {
  const enabled = disabled !== true && !isLoading;

  const searchId = `${id}-search`;
  const searchFocusable = useFocusable(
    searchId,
    enabled && onSearch != undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const specifyOtherToken = specifyOtherOption?.token;
  const isCustomActive = Boolean(customOptionForm && specifyOtherToken);

  return (
    <box id={id} flexDirection="column" style={{ gap: 1 }}>
      {onSearch ? (
        <box
          style={{ border: true, height: 3, paddingLeft: 1, paddingRight: 1 }}
        >
          <input
            value={searchQuery}
            placeholder={placeholder ?? "Search"}
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

      <box flexDirection="column" style={{ gap: 0 }}>
        {displayOptions.map((option) => {
          const optionId = `${id}-${option.token}-option`;
          const selectedOption = selectedByToken.get(option.token);
          const isSpecifyOther = option.token === specifyOtherToken;
          const checked = isSpecifyOther
            ? isCustomActive || Boolean(selectedOption)
            : Boolean(selectedOption);

          const optionDisabled =
            !enabled ||
            (option.disabled === true && !(isSpecifyOther && isCustomActive));

          return (
            <box key={option.token} flexDirection="column" style={{ gap: 0 }}>
              <Checkbox
                id={optionId}
                checked={checked}
                disabled={optionDisabled}
                label={option.label}
                ariaLabelledBy=""
                onChange={() => {
                  if (checked) {
                    onDeselect(option.token);
                  } else {
                    onSelect(option.token);
                  }
                }}
              />
              {selectedOption?.errors}
            </box>
          );
        })}
      </box>

      {isLoading ? <InlineText dim>Loading…</InlineText> : undefined}
      {customOptionForm}
    </box>
  );
}
