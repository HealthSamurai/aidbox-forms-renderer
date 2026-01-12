import { Box, Loader, Stack } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { CheckboxListProperties } from "@aidbox-forms/theme";

function joinIds(...parts: Array<string | undefined>) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value.length > 0 ? value : undefined;
}

export function CheckboxList({
  options,
  selectedOptions,
  specifyOtherOption,
  customOptionForm,
  onSelect,
  onDeselect,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
}: CheckboxListProperties) {
  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedByToken = new Map(
    selectedOptions.map((option) => [option.token, option]),
  );
  const specifyOtherToken = specifyOtherOption?.token;
  const isCustomActive = Boolean(customOptionForm && specifyOtherToken);

  const groupDescribedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };

  return (
    <Stack
      id={id}
      gap="xs"
      aria-busy={isLoading}
      role="group"
      aria-labelledby={ariaLabelledBy}
      {...groupDescribedByProperties}
    >
      {displayOptions.length > 0 ? (
        <Stack gap={4}>
          {displayOptions.map((option, index) => {
            const optionId = `${id}-option-${index}`;
            const selectedOption = selectedByToken.get(option.token);
            const isSpecifyOtherOption = option.token === specifyOtherToken;
            const checked = isSpecifyOtherOption
              ? isCustomActive || Boolean(selectedOption)
              : Boolean(selectedOption);

            const optionDescribedBy = joinIds(
              ariaDescribedBy,
              selectedOption?.ariaDescribedBy,
            );
            const describedByProperties =
              optionDescribedBy == undefined
                ? {}
                : { "aria-describedby": optionDescribedBy };

            const optionDisabled =
              disabled === true ||
              isLoading ||
              (option.disabled === true &&
                !(isSpecifyOtherOption && isCustomActive));

            return (
              <Box key={option.token}>
                <label
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    name={id}
                    checked={checked}
                    disabled={optionDisabled}
                    aria-labelledby={`${ariaLabelledBy} ${optionId}`}
                    {...describedByProperties}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.currentTarget.checked) {
                        onSelect(option.token);
                      } else {
                        onDeselect(option.token);
                      }
                    }}
                  />
                  <span id={optionId}>{option.label}</span>
                </label>
                {selectedOption?.errors}
              </Box>
            );
          })}
        </Stack>
      ) : undefined}

      {isLoading ? <Loader size="xs" /> : undefined}
      {customOptionForm ? <Box>{customOptionForm}</Box> : undefined}
    </Stack>
  );
}
