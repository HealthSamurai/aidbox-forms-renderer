import { useCallback, useMemo, useState } from "react";
import type { Coding, Quantity } from "fhir/r5";
import { isEmptyObject } from "../../../utils.ts";

type UseUnitInteractionParams = {
  value: Quantity | null;
  onChange: (next: Quantity | null) => void;
  singleUnitCoding: Coding | undefined;
  hasSingleUnit: boolean;
  getCodingForKey: (key: string) => Coding | null;
  getKeyForQuantity: (candidate: Quantity | null) => string;
  firstEnabledOptionKey: string | null;
};

export function useUnitInteraction({
  value,
  onChange,
  singleUnitCoding,
  hasSingleUnit,
  getCodingForKey,
  getKeyForQuantity,
  firstEnabledOptionKey,
}: UseUnitInteractionParams) {
  const [hasManualSelection, setHasManualSelection] = useState(false);

  const shouldAutoSelect = useMemo(() => {
    if (!hasSingleUnit || hasManualSelection) {
      return false;
    }

    if (!firstEnabledOptionKey) {
      return false;
    }

    if (value?.code || value?.system || value?.unit) {
      return false;
    }

    if (value?.value != null) {
      return false;
    }

    return true;
  }, [
    firstEnabledOptionKey,
    hasManualSelection,
    hasSingleUnit,
    value?.code,
    value?.system,
    value?.unit,
    value?.value,
  ]);

  const applyQuantityChange = useCallback(
    (builder: (draft: Quantity) => void) => {
      const draft: Quantity = { ...(value ?? {}) };
      builder(draft);
      if (isEmptyObject(draft)) {
        onChange(null);
      } else {
        onChange(draft);
      }
    },
    [onChange, value],
  );

  const handleNumberChange = useCallback(
    (raw: string) => {
      if (raw === "") {
        applyQuantityChange((draft) => {
          delete draft.value;
        });
        return;
      }

      const parsed = Number(raw);
      if (Number.isNaN(parsed)) {
        return;
      }

      const autoCoding = shouldAutoSelect ? singleUnitCoding : undefined;

      applyQuantityChange((draft) => {
        draft.value = parsed;
        if (autoCoding) {
          draft.unit = autoCoding.display ?? autoCoding.code ?? undefined;
          draft.code = autoCoding.code ?? undefined;
          draft.system = autoCoding.system ?? undefined;
        }
      });

      if (shouldAutoSelect) {
        setHasManualSelection(true);
      }
    },
    [applyQuantityChange, shouldAutoSelect, singleUnitCoding],
  );

  const handleSelectChange = useCallback(
    (key: string) => {
      if (!key) {
        applyQuantityChange((draft) => {
          delete draft.unit;
          delete draft.code;
          delete draft.system;
        });
        if (hasSingleUnit) {
          setHasManualSelection(true);
        }
        return;
      }

      const coding = getCodingForKey(key);
      if (!coding) {
        return;
      }

      applyQuantityChange((draft) => {
        draft.unit = coding.display ?? coding.code ?? undefined;
        draft.code = coding.code ?? undefined;
        draft.system = coding.system ?? undefined;
      });

      if (hasSingleUnit) {
        setHasManualSelection(true);
      }
    },
    [applyQuantityChange, getCodingForKey, hasSingleUnit],
  );

  const handleFreeTextChange = useCallback(
    (text: string) => {
      applyQuantityChange((draft) => {
        if (text) {
          draft.unit = text;
        } else {
          delete draft.unit;
        }
        delete draft.code;
        delete draft.system;
      });
    },
    [applyQuantityChange],
  );

  const displayKey = useMemo(() => {
    if (shouldAutoSelect && firstEnabledOptionKey) {
      return firstEnabledOptionKey;
    }

    return getKeyForQuantity(value);
  }, [firstEnabledOptionKey, getKeyForQuantity, shouldAutoSelect, value]);

  return {
    displayKey,
    handleNumberChange,
    handleSelectChange,
    handleFreeTextChange,
  } as const;
}
