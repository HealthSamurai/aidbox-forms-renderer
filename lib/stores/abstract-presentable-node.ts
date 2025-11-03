import { computed, makeObservable } from "mobx";
import { IPresentableNode, IForm, INode, IScope } from "./types.ts";
import type {
  Coding,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { EXT, findExtension, getItemControl } from "../utils.ts";

export abstract class AbstractPresentableNode implements IPresentableNode {
  readonly form: IForm;
  readonly template: QuestionnaireItem;
  readonly parentStore: INode | null;

  protected constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
  ) {
    makeObservable(this);

    this.form = form;
    this.template = template;
    this.parentStore = parentStore;
  }

  @computed
  get linkId() {
    const { linkId } = this.template;
    if (!linkId) {
      throw new Error("Questionnaire item linkId is missing.");
    }
    return linkId;
  }

  @computed
  get text() {
    return this.template.text;
  }

  @computed
  get prefix() {
    return this.template.prefix;
  }

  @computed
  get help() {
    return (
      this.template.item?.find(
        (item) => item.type === "display" && getItemControl(item) === "help",
      )?.text ?? undefined
    );
  }

  @computed
  get required() {
    return !!this.template.required;
  }

  @computed
  get readOnly() {
    // Group-level readOnly cascades; individual questions only affect themselves.
    const parent = this.parentStore;
    if (parent && parent.template.type === "group" && parent.readOnly) {
      return true;
    }

    return (
      !!this.template.readOnly ||
      (!this.isEnabled && this.template.disabledDisplay === "protected")
    );
  }

  @computed
  get hidden() {
    // Explicit questionnaire-hidden wins; otherwise disabled items vanish unless protected.
    if (findExtension(this.template, EXT.HIDDEN)?.valueBoolean === true) {
      return true;
    }

    if (!this.isEnabled) {
      return this.template.disabledDisplay !== "protected";
    }

    return false;
  }

  @computed
  get unitDisplay(): string | undefined {
    if (this.template.type !== "integer" && this.template.type !== "decimal") {
      return undefined;
    }

    return (
      this.template.item?.find(
        (item) => item.type === "display" && getItemControl(item) === "unit",
      )?.text ??
      findExtension(this.template, EXT.QUESTIONNAIRE_UNIT)?.valueCoding?.display
    );
  }

  @computed
  get unitOptions(): readonly Coding[] {
    return this.template.type !== "quantity"
      ? []
      : (this.template.extension ?? [])
          .filter(({ url }) => url === EXT.QUESTIONNAIRE_UNIT_OPTION)
          .map((extension) => extension.valueCoding)
          .filter((coding): coding is Coding => coding != null);
  }

  abstract get scope(): IScope;

  abstract get key(): string;

  abstract get isEnabled(): boolean;

  abstract get hasErrors(): boolean;

  abstract markDirty(): void;

  abstract clearDirty(): void;

  abstract get responseItems(): QuestionnaireResponseItem[];

  abstract get expressionItems(): QuestionnaireResponseItem[];

  abstract get issues(): Array<OperationOutcomeIssue>;

  abstract dispose(): void;
}
