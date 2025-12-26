import { action, computed, makeObservable, observable } from "mobx";
import type { Coding, Quantity } from "fhir/r5";
import type {
  IAnswerInstance,
  IQuantityAnswer,
  OptionItem,
} from "../../../types.ts";
import { areCodingsEqual, isEmptyObject } from "../../../utils.ts";

const LEGACY_UNIT_PREFIX = "__legacy_unit__";

function makeUnitToken(coding: Coding): string {
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
      const token = makeUnitToken(coding);
      if (!map.has(token)) {
        map.set(token, coding);
      }
    }
    return [...map.entries()];
  }

  @computed
  private get fallbackOption(): OptionItem | null {
    if (this.unitEntries.length === 0) {
      return null;
    }

    const tokenForQuantity = this.getUnitTokenForQuantity(this.quantityValue);
    if (tokenForQuantity) {
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
      token: `${LEGACY_UNIT_PREFIX}${label}`,
      label,
    };
  }

  @computed
  get entries(): ReadonlyArray<OptionItem> {
    const base = this.unitEntries.map<OptionItem>(([token, coding]) => ({
      token,
      label: coding.display ?? coding.code ?? coding.system ?? token,
      disabled: false,
    }));

    const fallback = this.fallbackOption;
    if (!fallback) {
      return base;
    }

    return [
      {
        token: fallback.token,
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

  private get firstEnabledOptionToken(): string | null {
    const option = this.entries.find((entry) => !entry.disabled);
    return option?.token ?? null;
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

    const firstToken = this.firstEnabledOptionToken;
    if (!firstToken) {
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
  get displayUnitToken(): string {
    if (this.shouldAutoSelectUnit) {
      return this.firstEnabledOptionToken ?? "";
    }

    const fallback = this.fallbackOption;
    if (fallback) {
      return fallback.token;
    }

    return this.getUnitTokenForQuantity(this.quantityValue);
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
  handleSelectChange(token: string): void {
    if (!token) {
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

    if (token.startsWith(LEGACY_UNIT_PREFIX)) {
      return;
    }

    const coding = this.getCodingForToken(token);
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

  private getCodingForToken(token: string): Coding | null {
    const found = this.unitEntries.find(([entryToken]) => entryToken === token);
    return found?.[1] ?? null;
  }

  private getUnitTokenForCoding(coding: Coding | null | undefined): string {
    if (!coding) {
      return "";
    }

    for (const [token, candidate] of this.unitEntries) {
      if (areCodingsEqual(candidate, coding)) {
        return token;
      }
    }

    return "";
  }

  private getUnitTokenForQuantity(quantity: Quantity | null): string {
    if (!quantity) {
      return "";
    }

    if (quantity.code || quantity.system) {
      return this.getUnitTokenForCoding({
        code: quantity.code,
        system: quantity.system,
        display: quantity.unit,
      });
    }

    if (quantity.unit) {
      const unit = quantity.unit;
      return (
        this.getUnitTokenForCoding({
          system: quantity.system,
          code: unit,
        }) ||
        this.getUnitTokenForCoding({
          system: quantity.system,
          display: unit,
        })
      );
    }

    return "";
  }
}
