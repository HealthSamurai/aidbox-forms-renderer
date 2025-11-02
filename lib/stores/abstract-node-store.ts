import { computed, observable, runInAction } from "mobx";
import {
  AnswerType,
  ExpressionEnvironment,
  IBaseNode,
  IExpressionEnvironmentProvider,
  IForm,
  INode,
  IScope,
} from "./types.ts";
import {
  Extension,
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
} from "fhir/r5";
import { ExpressionRegistry } from "./expression-registry.ts";
import {
  booleanify,
  evaluateEnableWhenCondition,
  EXT,
  findExtension,
} from "../utils.ts";
import { isQuestionNode } from "./question-store.ts";
import { CoreAbstractNode } from "./core-abstract-node.ts";

export abstract class AbstractNodeStore
  extends CoreAbstractNode
  implements IBaseNode, IExpressionEnvironmentProvider
{
  protected _scope: IScope;
  protected _key: string;
  protected _expressionRegistry: ExpressionRegistry | undefined;

  @observable
  private dirty = false;

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
  ) {
    super(form, template, parentStore);

    this._scope = this.createScope(parentScope);
    this._key = this.createKey(parentKey);

    this.initializeExpressionRegistry(this, template.extension);
  }

  protected createScope(baseScope: IScope): IScope {
    return baseScope.extend(false);
  }

  protected createKey(baseKey: string): string {
    const link = this.template.linkId ?? "<missing>";
    return `${baseKey}_/_${link}`;
  }

  get scope(): IScope {
    return this._scope;
  }

  get key(): string {
    return this._key;
  }

  get expressionRegistry(): ExpressionRegistry | undefined {
    return this._expressionRegistry;
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.form.questionnaire,
      qitem: this.template,
      context: this.expressionItems.at(0),
    });
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
  get isEnabled() {
    if (this.parentStore && !this.parentStore.isEnabled) {
      return false;
    }

    const enableWhenSlot = this.expressionRegistry?.enableWhen;
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
  get hasErrors() {
    return this.issues.length > 0;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (!this.isEnabled) {
      return [];
    }

    const registryIssues = this.expressionRegistry?.issues ?? [];

    return registryIssues.concat(
      this.shouldValidate ? this.computeIssues() : [],
    );
  }

  @computed
  get isDirty() {
    return this.dirty;
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

  protected computeIssues(): OperationOutcomeIssue[] {
    return [];
  }

  protected initializeExpressionRegistry(
    provider: IExpressionEnvironmentProvider,
    extensions: Extension[] | undefined,
  ) {
    if (extensions?.length) {
      this._expressionRegistry = new ExpressionRegistry(
        this.form.coordinator,
        this.scope,
        provider,
        extensions,
        this.template.type as AnswerType,
      );
    }
  }

  private evaluateEnableWhen(condition: QuestionnaireItemEnableWhen): boolean {
    const target = this.scope.lookupNode(condition.question);
    return isQuestionNode(target)
      ? evaluateEnableWhenCondition(this, condition, target)
      : false;
  }
}
