import {
  ExpressionEnvironment,
  IBaseNodeStore,
  IExpressionEnvironmentProvider,
  IFormStore,
  INodeStore,
  IScope,
} from "./types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { computed, makeObservable, observable, runInAction } from "mobx";
import {
  booleanify,
  evaluateEnableWhenCondition,
  EXT,
  findExtension,
  isQuestion,
} from "../utils.ts";
import { ExpressionRegistry } from "./expression-registry.ts";

export abstract class AbstractNodeStore
  implements IBaseNodeStore, IExpressionEnvironmentProvider
{
  readonly template: QuestionnaireItem;
  readonly form: IFormStore;
  readonly parentStore: INodeStore | null;
  readonly key: string;
  readonly scope: IScope;

  @observable
  private dirty = false;

  readonly expressionRegistry: ExpressionRegistry;

  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: IScope,
    parentKey: string,
  ) {
    makeObservable(this);

    this.form = form;
    this.template = template;
    this.parentStore = parentStore;
    this.scope = parentScope.extend(false);
    this.key = `${parentKey}_/_${template.linkId}`;

    const extensions = [
      ...(this.template.extension ?? []),
      ...(this.template.modifierExtension ?? []),
    ];

    this.expressionRegistry = new ExpressionRegistry(
      this.form.coordinator,
      this.scope,
      this,
      extensions,
    );
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.form.questionnaire,
      qitem: this.template,
      // todo: fix it for repeating group node
      context: this.expressionItems.at(0),
    });
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
      findExtension(this.template, EXT.MIN_OCCURS)?.valueInteger ??
      (this.required ? 1 : 0)
    );
  }

  @computed
  get maxOccurs() {
    return findExtension(this.template, EXT.MAX_OCCURS)?.valueInteger;
  }

  @computed
  get enableWhenExpression() {
    return findExtension(this.template, EXT.SDC_ENABLE_WHEN_EXPR)
      ?.valueExpression;
  }

  @computed
  get calculatedExpression() {
    return findExtension(this.template, EXT.SDC_CALCULATED_EXPR)
      ?.valueExpression;
  }

  @computed
  get initialExpression() {
    return findExtension(this.template, EXT.SDC_INITIAL_EXPR)?.valueExpression;
  }

  @computed
  get isEnabled() {
    if (this.parentStore && !this.parentStore.isEnabled) {
      return false;
    }

    if (this.expressionRegistry.enableWhen) {
      return booleanify(this.expressionRegistry.enableWhen.value);
    }

    const enableWhen = this.template.enableWhen;
    if (!enableWhen || enableWhen.length === 0) {
      return true;
    }

    const behavior = this.template.enableBehavior ?? "any";
    const results = enableWhen.map((condition) =>
      this.evaluateEnableWhen(condition),
    );

    return behavior === "all" ? results.every(Boolean) : results.some(Boolean);
  }

  @computed
  get hasErrors() {
    return this.issues.length > 0;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    return !this.isEnabled
      ? []
      : this.expressionRegistry.issues.concat(
          this.shouldValidate ? this.computeIssues() : [],
        );
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

  abstract get expressionItems(): QuestionnaireResponseItem[];

  private evaluateEnableWhen(condition: QuestionnaireItemEnableWhen): boolean {
    const target = this.scope.lookupNode(condition.question);
    return isQuestion(target)
      ? evaluateEnableWhenCondition(condition, target)
      : false;
  }
}
