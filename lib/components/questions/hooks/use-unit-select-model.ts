import { useCallback, useMemo } from "react";
import type { Coding, Quantity } from "fhir/r5";
import type { UnitOptionEntry } from "./use-unit-catalog.ts";

export type UnitSelectOption = {
  key: string;
  label: string;
  disabled: boolean;
};

function resolveQuantityKey(
  getKeyForCoding: (coding: Coding | null | undefined) => string,
  quantity: Quantity | null,
): string {
  if (!quantity) {
    return "";
  }

  if (quantity.code || quantity.system) {
    return getKeyForCoding({
      code: quantity.code,
      system: quantity.system,
      display: quantity.unit,
    });
  }

  if (quantity.unit) {
    const unit = quantity.unit;
    return (
      getKeyForCoding({
        system: quantity.system,
        code: unit,
      }) ??
      getKeyForCoding({
        system: quantity.system,
        display: unit,
      })
    );
  }

  return "";
}

export function useUnitSelectModel(
  optionEntries: readonly UnitOptionEntry[],
  quantity: Quantity | null,
  getKeyForCoding: (coding: Coding | null | undefined) => string,
) {
  const keyForQuantity = useMemo(
    () => resolveQuantityKey(getKeyForCoding, quantity),
    [getKeyForCoding, quantity],
  );

  const fallbackOption = useMemo(() => {
    if (keyForQuantity || !quantity || optionEntries.length === 0) {
      return null;
    }

    const label = quantity.unit ?? quantity.code ?? quantity.system;
    if (!label) {
      return null;
    }

    return {
      key: `__existing_unit__${label}`,
      label,
    } as const;
  }, [keyForQuantity, optionEntries.length, quantity]);

  const baseOptions = useMemo<UnitSelectOption[]>(
    () =>
      optionEntries.map(([key, coding]) => ({
        key,
        label: coding.display ?? coding.code ?? coding.system ?? key,
        disabled: false as const,
      })),
    [optionEntries],
  );

  const selectOptions = useMemo<UnitSelectOption[]>(() => {
    if (!fallbackOption) {
      return baseOptions;
    }

    return [
      {
        key: fallbackOption.key,
        label: fallbackOption.label,
        disabled: true as const,
      },
      ...baseOptions,
    ];
  }, [baseOptions, fallbackOption]);

  const firstEnabledOptionKey = useMemo(() => {
    const option = selectOptions.find((entry) => !entry.disabled);
    return option?.key ?? null;
  }, [selectOptions]);

  const getKeyForQuantity = useCallback(
    (candidate: Quantity | null) =>
      candidate === quantity
        ? fallbackOption?.key ?? keyForQuantity ?? ""
        : resolveQuantityKey(getKeyForCoding, candidate),
    [fallbackOption, getKeyForCoding, keyForQuantity, quantity],
  );

  return {
    selectOptions,
    firstEnabledOptionKey,
    getKeyForQuantity,
  } as const;
}
