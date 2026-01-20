import {
  NumberInput as MantineNumberInput,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import type { SpinnerInputProperties } from "@formbox/theme";

function parseNumberInput(value: number | string): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function SpinnerInput({
  id,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  unitLabel,
}: SpinnerInputProperties) {
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId].filter(Boolean).join(" ");

  const describedByProperties =
    describedBy.length > 0 ? { "aria-describedby": describedBy } : {};
  const placeholderProperties = placeholder == undefined ? {} : { placeholder };
  const stepProperties = step == undefined ? {} : { step };
  const minProperties = min == undefined ? {} : { min };
  const maxProperties = max == undefined ? {} : { max };

  const rightSectionProperties = unitLabel
    ? {
        rightSection: (
          <Text size="sm" c="dimmed">
            {unitLabel}
          </Text>
        ),
      }
    : {};

  return (
    <>
      {unitLabel && unitId ? (
        <VisuallyHidden id={unitId}>{unitLabel}</VisuallyHidden>
      ) : undefined}
      <MantineNumberInput
        id={id}
        value={value ?? ""}
        onChange={(nextValue: number | string) => {
          const parsed = parseNumberInput(nextValue);
          onChange(parsed);
        }}
        disabled={disabled === true}
        aria-labelledby={ariaLabelledBy}
        {...describedByProperties}
        {...placeholderProperties}
        {...stepProperties}
        {...minProperties}
        {...maxProperties}
        {...rightSectionProperties}
      />
    </>
  );
}
