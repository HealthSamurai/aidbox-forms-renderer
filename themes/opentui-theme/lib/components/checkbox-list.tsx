import type { CheckboxListProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";
import { Checkbox } from "./checkbox.tsx";

export function CheckboxList({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  specifyOtherOption,
  customOptionForm,
  id,
  disabled,
  isLoading = false,
}: CheckboxListProperties) {
  const enabled = disabled !== true && !isLoading;

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
