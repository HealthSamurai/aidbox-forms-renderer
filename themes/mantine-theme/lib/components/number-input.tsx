import {
  NumberInput as MantineNumberInput,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import type { NumberInputProperties } from "@aidbox-forms/theme";

function parseNumberInput(value: number | string): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  min,
  max,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
}: NumberInputProperties) {
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId].filter(Boolean).join(" ");
  const safeStep = typeof step === "number" ? step : undefined;

  const describedByProps =
    describedBy.length > 0 ? { "aria-describedby": describedBy } : {};
  const placeholderProps = placeholder == undefined ? {} : { placeholder };
  const stepProps = safeStep == undefined ? {} : { step: safeStep };
  const minProps = min == undefined ? {} : { min };
  const maxProps = max == undefined ? {} : { max };

  const rightSectionProps = unitLabel
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
      ) : null}
      <MantineNumberInput
        id={id}
        value={value ?? ""}
        onChange={(nextValue: number | string) => {
          const parsed = parseNumberInput(nextValue);
          onChange(parsed);
        }}
        disabled={disabled === true}
        aria-labelledby={ariaLabelledBy}
        {...describedByProps}
        {...placeholderProps}
        {...stepProps}
        {...minProps}
        {...maxProps}
        hideControls
        {...rightSectionProps}
      />
    </>
  );
}
