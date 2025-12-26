import {
  computed,
  makeObservable,
  observable,
  override,
  runInAction,
} from "mobx";
import {
  ExpressionEnvironment,
  IActualNode,
  IExpressionEnvironmentProvider,
  IForm,
  INode,
  INodeValidator,
  IScope,
} from "../../../types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
} from "fhir/r5";
import { NodeExpressionRegistry } from "../../expressions/node-expression-registry.ts";
import {
  booleanify,
  evaluateEnableWhenCondition,
  EXT,
  findExtension,
  normalizeExpressionValues,
} from "../../../utils.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { AbstractPresentableNode } from "./abstract-presentable-node.ts";

export abstract class AbstractActualNodeStore
  extends AbstractPresentableNode
  implements IActualNode, IExpressionEnvironmentProvider
{
  protected _scope: IScope;
  protected _token: string;
  abstract readonly expressionRegistry: NodeExpressionRegistry;
  protected validator: INodeValidator | undefined;

  @observable
  private dirty = false;

  protected constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    token: string,
  ) {
    super(form, template, parentStore);

    makeObservable(this);

    this._scope = scope;
    this._token = token;
  }

  get scope(): IScope {
    return this._scope;
  }

  get token(): string {
    return this._token;
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.form.questionnaire,
      resource: this.form.expressionResponse,
      qitem: this.template,
      context: this.expressionItems.at(0),
    });
  }

  @computed
  get minOccurs() {
    const minOccursSlot = this.expressionRegistry.minOccurs;
    if (minOccursSlot) {
      const values = normalizeExpressionValues("integer", minOccursSlot.value);
      const candidate = values[0];
      if (candidate != null && Number.isFinite(candidate) && candidate >= 0) {
        return Math.floor(candidate);
      }
    }

    const extensionValue = findExtension(
      this.template,
      EXT.MIN_OCCURS,
    )?.valueInteger;
    if (typeof extensionValue === "number") {
      return extensionValue;
    }

    return this.required ? 1 : 0;
  }

  @computed
  get maxOccurs() {
    const maxOccursSlot = this.expressionRegistry.maxOccurs;
    if (maxOccursSlot) {
      const values = normalizeExpressionValues("integer", maxOccursSlot.value);
      const candidate = values[0];
      if (candidate != null && Number.isFinite(candidate) && candidate >= 0) {
        return Math.floor(candidate);
      }
    }

    const extensionValue = findExtension(
      this.template,
      EXT.MAX_OCCURS,
    )?.valueInteger;
    if (typeof extensionValue === "number") {
      return extensionValue;
    }

    return Number.POSITIVE_INFINITY;
  }

  @override
  override get required() {
    const slot = this.expressionRegistry.required;
    if (slot) {
      return booleanify(slot.value);
    }

    return super.required;
  }

  @computed
  protected get _isEnabled() {
    const enableWhenSlot = this.expressionRegistry.enableWhen;
    if (enableWhenSlot) {
      return booleanify(enableWhenSlot.value);
    }

    if (!this.template.enableWhen || this.template.enableWhen.length === 0) {
      return true;
    }

    const behavior = this.template.enableBehavior ?? "any";
    const results = this.template.enableWhen.map((condition) =>
      this.evaluateEnableWhen(condition),
    );

    return behavior === "all" ? results.every(Boolean) : results.some(Boolean);
  }

  @computed
  protected get _readOnly() {
    const slot = this.expressionRegistry.readOnly;
    if (slot) {
      return booleanify(slot.value);
    }

    return !!this.template.readOnly;
  }

  @computed
  get hasErrors() {
    return this.issues.length > 0;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (!this.isEnabled) {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];

    issues.push(...this.expressionRegistry.registrationIssues);
    issues.push(...this.expressionRegistry.slotsIssues);

    const shouldApplyConstraints = this.shouldValidate && !this.readOnly;
    if (shouldApplyConstraints) {
      issues.push(...this.expressionRegistry.constraintsIssues);
    }

    if (this.shouldValidate && this.validator) {
      issues.push(...this.validator.issues);
    }

    return issues;
  }

  @computed
  get isDirty() {
    return this.dirty;
  }

  override get text(): string | undefined {
    const slot = this.expressionRegistry.text;
    if (slot) {
      return normalizeExpressionValues("text", slot.value).at(0) ?? undefined;
    }
    return this.template.text;
  }

  markDirty() {
    if (!this.dirty) {
      runInAction(() => {
        this.dirty = true;
      });
      this.parentStore?.markDirty?.();
    }
  }

  clearDirty() {
    if (this.dirty) {
      runInAction(() => {
        this.dirty = false;
      });
    }
  }

  protected get shouldValidate() {
    return this.form.isSubmitAttempted || this.isDirty;
  }

  private evaluateEnableWhen(condition: QuestionnaireItemEnableWhen): boolean {
    const target = this.scope.lookupNode(condition.question);
    return isQuestionNode(target)
      ? evaluateEnableWhenCondition(this, condition, target)
      : false;
  }
}
