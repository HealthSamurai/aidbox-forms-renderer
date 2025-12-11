import { action, computed, makeObservable, observable } from "mobx";
import type { Coding, Quantity } from "fhir/r5";
import type {
  IAnswerInstance,
  IQuantityAnswer,
  UnitOptionEntry,
} from "../../types.ts";
import { areCodingsEqual, isEmptyObject } from "../../utils.ts";

const LEGACY_UNIT_PREFIX = "__legacy_unit__";

function makeUnitKey(coding: Coding): string {
  return [coding.system ?? "", coding.code ?? "", coding.display ?? ""].join(
    "::",
  );
}

export class QuantityAnswer implements IQuantityAnswer {
  private readonly answer: IAnswerInstance<"quantity">;

  constructor(answer: IAnswerInstance<"quantity">) {
    this.answer = answer;
    makeObservable(this);
  }

  @observable
  private hasManualSelection = false;

  private get quantityValue(): Quantity | null {
    return (this.answer.value as Quantity | null) ?? null;
  }

  @computed
  private get unitEntries(): ReadonlyArray<readonly [string, Coding]> {
    const map = new Map<string, Coding>();
    for (const coding of this.answer.question.unitOptions) {
      const key = makeUnitKey(coding);
      if (!map.has(key)) {
        map.set(key, coding);
      }
    }
    return [...map.entries()];
  }

  @computed
  private get fallbackOption(): { key: string; label: string } | null {
    if (this.unitEntries.length === 0) {
      return null;
    }

    const keyForQuantity = this.getUnitKeyForQuantity(this.quantityValue);
    if (keyForQuantity) {
      return null;
    }

    const quantity = this.quantityValue;
    if (!quantity) {
      return null;
    }

    const label = quantity.unit ?? quantity.code ?? quantity.system;
    if (!label) {
      return null;
    }

    return {
      key: `${LEGACY_UNIT_PREFIX}${label}`,
      label,
    };
  }

  @computed
  get entries(): ReadonlyArray<UnitOptionEntry> {
    const base = this.unitEntries.map<UnitOptionEntry>(([key, coding]) => ({
      key,
      label: coding.display ?? coding.code ?? coding.system ?? key,
      disabled: false,
    }));

    const fallback = this.fallbackOption;
    if (!fallback) {
      return base;
    }

    return [
      {
        key: fallback.key,
        label: fallback.label,
        disabled: true,
      },
      ...base,
    ];
  }

  @computed
  get isUnitFreeForm(): boolean {
    return this.unitEntries.length === 0;
  }

  private get firstEnabledOptionKey(): string | null {
    const option = this.entries.find((entry) => !entry.disabled);
    return option?.key ?? null;
  }

  private get hasSingleUnit(): boolean {
    return this.unitEntries.length === 1;
  }

  private get singleUnitCoding(): Coding | undefined {
    return this.hasSingleUnit ? this.unitEntries[0][1] : undefined;
  }

  private get shouldAutoSelectUnit(): boolean {
    if (!this.hasSingleUnit || this.hasManualSelection) {
      return false;
    }

    const firstKey = this.firstEnabledOptionKey;
    if (!firstKey) {
      return false;
    }

    const quantity = this.quantityValue;
    if (!quantity) {
      return true;
    }

    if (quantity.code || quantity.system || quantity.unit) {
      return false;
    }

    if (quantity.value != null) {
      return false;
    }

    return true;
  }

  @computed
  get displayUnitKey(): string {
    if (this.shouldAutoSelectUnit) {
      return this.firstEnabledOptionKey ?? "";
    }

    const fallback = this.fallbackOption;
    if (fallback) {
      return fallback.key;
    }

    return this.getUnitKeyForQuantity(this.quantityValue);
  }

  @action
  handleNumberInput(raw: string): void {
    if (raw === "") {
      this.applyQuantityChange((draft) => {
        delete draft.value;
      });
      return;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      return;
    }

    const autoCoding =
      this.shouldAutoSelectUnit && this.singleUnitCoding
        ? this.singleUnitCoding
        : undefined;

    this.applyQuantityChange((draft) => {
      draft.value = parsed;
      if (autoCoding) {
        draft.unit = autoCoding.display ?? autoCoding.code ?? undefined;
        draft.code = autoCoding.code ?? undefined;
        draft.system = autoCoding.system ?? undefined;
      }
    });

    if (this.shouldAutoSelectUnit) {
      this.hasManualSelection = true;
    }
  }

  @action
  handleSelectChange(key: string): void {
    if (!key) {
      this.applyQuantityChange((draft) => {
        delete draft.unit;
        delete draft.code;
        delete draft.system;
      });
      if (this.hasSingleUnit) {
        this.hasManualSelection = true;
      }
      return;
    }

    if (key.startsWith(LEGACY_UNIT_PREFIX)) {
      return;
    }

    const coding = this.getCodingForKey(key);
    if (!coding) {
      return;
    }

    this.applyQuantityChange((draft) => {
      draft.unit = coding.display ?? coding.code ?? undefined;
      draft.code = coding.code ?? undefined;
      draft.system = coding.system ?? undefined;
    });

    if (this.hasSingleUnit) {
      this.hasManualSelection = true;
    }
  }

  @action
  handleFreeTextChange(text: string): void {
    this.applyQuantityChange((draft) => {
      if (text) {
        draft.unit = text;
      } else {
        delete draft.unit;
      }
      delete draft.code;
      delete draft.system;
    });
  }

  private applyQuantityChange(builder: (draft: Quantity) => void) {
    const draft: Quantity = { ...(this.quantityValue ?? {}) };
    builder(draft);
    this.answer.setValueByUser(isEmptyObject(draft) ? null : draft);
  }

  private getCodingForKey(key: string): Coding | null {
    const found = this.unitEntries.find(([entryKey]) => entryKey === key);
    return found?.[1] ?? null;
  }

  private getUnitKeyForCoding(coding: Coding | null | undefined): string {
    if (!coding) {
      return "";
    }

    for (const [key, candidate] of this.unitEntries) {
      if (areCodingsEqual(candidate, coding)) {
        return key;
      }
    }

    return "";
  }

  private getUnitKeyForQuantity(quantity: Quantity | null): string {
    if (!quantity) {
      return "";
    }

    if (quantity.code || quantity.system) {
      return this.getUnitKeyForCoding({
        code: quantity.code,
        system: quantity.system,
        display: quantity.unit,
      });
    }

    if (quantity.unit) {
      const unit = quantity.unit;
      return (
        this.getUnitKeyForCoding({
          system: quantity.system,
          code: unit,
        }) ||
        this.getUnitKeyForCoding({
          system: quantity.system,
          display: unit,
        })
      );
    }

    return "";
  }
}
