import { INodeScope, INodeStore, IFormStore, IBaseNodeStore } from "./types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  type QuestionnaireResponseItem,
} from "fhir/r5";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { EXT, findExtension } from "../utils.ts";

export abstract class AbstractNodeStore implements IBaseNodeStore {
  readonly template: QuestionnaireItem;
  readonly form: IFormStore;
  readonly parentStore: INodeStore | null;
  readonly path: string;
  readonly parentScope: INodeScope;

  @observable
  private dirty = false;

  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: INodeScope,
    parentPath: string,
  ) {
    makeObservable(this);

    this.form = form;
    this.template = template;
    this.parentStore = parentStore;
    this.parentScope = parentScope;
    this.path = `${parentPath}/${template.linkId}`;
  }

  @computed
  get isDirty() {
    return this.dirty;
  }

  @computed
  get linkId() {
    return this.template.linkId!;
  }

  @computed
  get type() {
    return this.template.type!;
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
  get required() {
    return !!this.template.required;
  }

  @computed
  get readOnly() {
    return !!this.template.readOnly;
  }

  @computed
  get repeats() {
    return !!this.template.repeats;
  }

  @computed
  get help() {
    // todo: support help from extensions
    return undefined;
  }

  // Extensions
  @computed
  get hidden() {
    return findExtension(this.template, EXT.HIDDEN)?.valueBoolean === true;
  }

  @computed
  get minOccurs() {
    return (
      findExtension(this.template, EXT.MIN)?.valueInteger ??
      (this.required ? 1 : 0)
    );
  }

  @computed
  get maxOccurs() {
    return findExtension(this.template, EXT.MAX)?.valueInteger;
  }

  @computed
  get enableWhenExpression() {
    return findExtension(this.template, EXT.SDC_ENABLE)?.valueExpression;
  }

  @computed
  get calculatedExpression() {
    return findExtension(this.template, EXT.SDC_CALC)?.valueExpression;
  }

  @computed
  get initialExpression() {
    return findExtension(this.template, EXT.SDC_INIT)?.valueExpression;
  }

  @computed
  get isEnabled() {
    // todo: implement enableWhen expression evaluation
    return true;
  }

  @computed
  get hasErrors() {
    return this.issues.length > 0;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (!this.shouldValidate || !this.isEnabled) {
      return [];
    }

    // TODO: extend computeIssues in subclasses for additional SDC constraints
    const issues = this.computeIssues();
    return Array.isArray(issues) ? issues : [];
  }

  lookupStore(linkId: string) {
    return this.parentScope?.lookupStore(linkId);
  }

  registerStore(node: INodeStore) {
    this.parentScope?.registerStore(node);
  }

  markDirty() {
    if (!this.dirty) {
      // Intentionally wrap the mutation in runInAction instead of decorating the whole
      // method as @action. Callers may invoke markDirty() outside an action, and we only
      // want the local state flip inside MobX’s transaction while allowing the recursive
      // parent propagation to remain lightweight.
      runInAction(() => {
        this.dirty = true;
      });
      this.parentStore?.markDirty();
    }
  }

  clearDirty() {
    if (this.dirty) {
      // Intentionally wrap the mutation in runInAction - see markDirty() for rationale.
      runInAction(() => {
        this.dirty = false;
      });
    }
  }

  protected get shouldValidate() {
    // TODO: respect enableWhen/calculated expressions to suppress validation when item is disabled.
    return this.form.isSubmitAttempted || this.isDirty;
  }

  protected computeIssues(): OperationOutcomeIssue[] {
    return [];
  }

  abstract get responseItems(): QuestionnaireResponseItem[];
}
