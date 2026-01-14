import type { RadioButtonListProperties } from "@aidbox-forms/theme";
import type { SelectOption } from "@opentui/core";
import { useMemo } from "react";
import { useFocusable } from "./focus-provider.tsx";
import { InlineText, toPlainText } from "./utilities.tsx";

export function RadioButtonList({
  options,
  selectedOption,
  onChange,
  specifyOtherOption,
  customOptionForm,
  id,
  disabled,
  isLoading = false,
}: RadioButtonListProperties) {
  const enabled = disabled !== true && !isLoading;
  const { focused } = useFocusable(id, enabled);

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
    const none: SelectOption = {
      name: "Select an option",
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
  }, [fullOptions]);

  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      <box
        style={{ border: true, height: 10, paddingLeft: 1, paddingRight: 1 }}
      >
        <select
          options={selectOptions}
          selectedIndex={Math.max(0, selectedIndex)}
          showDescription
          showScrollIndicator
          wrapSelection
          focused={focused}
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
