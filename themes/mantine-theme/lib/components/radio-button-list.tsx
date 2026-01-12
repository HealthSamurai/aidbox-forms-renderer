import { Box, Loader, Stack } from "@mantine/core";
import type { ChangeEvent } from "react";
import type { RadioButtonListProperties } from "@aidbox-forms/theme";

function joinIds(...parts: Array<string | undefined>) {
  const value = parts.filter(Boolean).join(" ").trim();
  return value.length > 0 ? value : undefined;
}

export function RadioButtonList({
  options,
  selectedOption,
  onChange,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
}: RadioButtonListProperties) {
  const displayOptions = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedToken = selectedOption?.token;

  const groupDescribedByProperties =
    ariaDescribedBy == undefined ? {} : { "aria-describedby": ariaDescribedBy };

  return (
    <Stack
      id={id}
      gap="xs"
      aria-busy={isLoading}
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      {...groupDescribedByProperties}
    >
      {displayOptions.length > 0 ? (
        <Stack gap={4}>
          {displayOptions.map((option, index) => {
            const optionId = `${id}-option-${index}`;
            const optionDescribedBy = joinIds(ariaDescribedBy);
            const describedByProperties =
              optionDescribedBy == undefined
                ? {}
                : { "aria-describedby": optionDescribedBy };

            const optionDisabled =
              disabled === true || isLoading || option.disabled === true;

            return (
              <Box key={option.token}>
                <label
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="radio"
                    name={id}
                    checked={selectedToken === option.token}
                    disabled={optionDisabled}
                    aria-labelledby={`${ariaLabelledBy} ${optionId}`}
                    {...describedByProperties}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.currentTarget.checked) {
                        onChange(option.token);
                      }
                    }}
                  />
                  <span id={optionId}>{option.label}</span>
                </label>
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
