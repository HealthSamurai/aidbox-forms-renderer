import { Box, Group, Slider, Text, VisuallyHidden } from "@mantine/core";
import { useId } from "react";
import type { SliderInputProperties } from "@aidbox-forms/theme";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SliderInput({
  value,
  onChange,
  disabled,
  min,
  max,
  step = 1,
  ariaLabelledBy,
  ariaDescribedBy,
  lowerLabel,
  upperLabel,
  unitLabel,
}: SliderInputProperties) {
  const sliderMin = typeof min === "number" ? min : 0;
  const sliderMax = typeof max === "number" ? max : sliderMin + 100;
  const normalizedValue = clamp(
    typeof value === "number" ? value : sliderMin,
    sliderMin,
    sliderMax,
  );

  const generatedId = useId();
  const unitId = unitLabel ? `${generatedId}-unit` : undefined;
  const describedBy = [ariaDescribedBy, unitId].filter(Boolean).join(" ");

  const describedByProps =
    describedBy.length > 0 ? { "aria-describedby": describedBy } : {};

  return (
    <Box>
      {unitLabel && unitId ? (
        <VisuallyHidden id={unitId}>{unitLabel}</VisuallyHidden>
      ) : null}
      <Slider
        value={normalizedValue}
        onChange={(nextValue: number) => onChange(nextValue)}
        min={sliderMin}
        max={sliderMax}
        step={step || 1}
        disabled={disabled === true}
        aria-labelledby={ariaLabelledBy}
        {...describedByProps}
        label={(v) => `${v}${unitLabel ? ` ${unitLabel}` : ""}`}
      />
      <Group justify="space-between" mt={4} aria-hidden="true">
        <Text size="sm" c="dimmed">
          {lowerLabel ?? (
            <>
              {sliderMin}
              {unitLabel ? ` ${unitLabel}` : ""}
            </>
          )}
        </Text>
        <Text size="sm" c="dimmed">
          {upperLabel ?? (
            <>
              {sliderMax}
              {unitLabel ? ` ${unitLabel}` : ""}
            </>
          )}
        </Text>
      </Group>
    </Box>
  );
}
