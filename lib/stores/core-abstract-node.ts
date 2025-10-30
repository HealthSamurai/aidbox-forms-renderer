import { computed, makeObservable } from "mobx";
import { ICoreNode, IForm, INode, IScope } from "./types.ts";
import {
  type OperationOutcomeIssue,
  QuestionnaireItem,
  type QuestionnaireResponseItem,
} from "fhir/r5";

export abstract class CoreAbstractNode implements ICoreNode {
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
    // TODO: support help from extensions
    return undefined;
  }

  @computed
  get required() {
    return !!this.template.required;
  }

  @computed
  get readOnly() {
    return !!this.template.readOnly;
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
}
