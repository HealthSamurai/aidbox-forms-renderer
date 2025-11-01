import { useCallback, useMemo } from "react";
import type { Coding } from "fhir/r5";
import { areCodingsEqual } from "../../../utils.ts";

export type UnitOptionEntry = readonly [string, Coding];

function makeOptionKey(coding: Coding): string {
  return [coding.system ?? "", coding.code ?? "", coding.display ?? ""].join(
    "::",
  );
}

export function useUnitCatalog(unitOptions: ReadonlyArray<Coding>) {
  const optionMap = useMemo(() => {
    const map = new Map<string, Coding>();
    for (const coding of unitOptions) {
      const key = makeOptionKey(coding);
      if (!map.has(key)) {
        map.set(key, coding);
      }
    }
    return map;
  }, [unitOptions]);

  const optionEntries = useMemo<UnitOptionEntry[]>(
    () => [...optionMap.entries()],
    [optionMap],
  );

  const getCodingForKey = useCallback(
    (key: string) => optionMap.get(key) ?? null,
    [optionMap],
  );

  const getKeyForCoding = useCallback(
    (coding: Coding | null | undefined) => {
      if (!coding) {
        return "";
      }

      for (const [key, candidate] of optionEntries) {
        if (areCodingsEqual(candidate, coding)) {
          return key;
        }
      }

      return "";
    },
    [optionEntries],
  );

  const hasSingleUnit = optionEntries.length === 1;
  const singleUnitCoding = hasSingleUnit ? optionEntries[0][1] : undefined;

  return {
    optionEntries,
    getCodingForKey,
    getKeyForCoding,
    hasSingleUnit,
    singleUnitCoding,
  } as const;
}
