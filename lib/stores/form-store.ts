import {
  IExpressionSlot,
  IFormStore,
  IScope,
  INodeStore,
  IEvaluationEnvironmentProvider,
  EvaluationEnvironment,
} from "./types.ts";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import {
  Expression,
  OperationOutcomeIssue,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { QuestionStore } from "./question-store.ts";
import { NonRepeatingGroupStore } from "./non-repeating-group-store.ts";
import { DisplayStore } from "./display-store.ts";
import { RepeatingGroupStore } from "./repeating-group-store.ts";
import { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import { ExpressionSlot } from "./expression-slot.ts";
import { EXT, makeIssue } from "../utils.ts";
import { DuplicateExpressionNameError, Scope } from "./scope.ts";

export class FormStore implements IFormStore, IEvaluationEnvironmentProvider {
  questionnaire: Questionnaire;
  private readonly initialResponse: QuestionnaireResponse | undefined;

  @observable.shallow
  readonly children = observable.array<INodeStore>([], {
    deep: false,
    name: "FormStore.children",
  });

  readonly scope = new Scope(true);

  private readonly expressionSlots: IExpressionSlot[] = [];

  @observable.shallow
  private readonly expressionIssues = observable.array<OperationOutcomeIssue>(
    [],
    { deep: false, name: "FormStore.expressionIssues" },
  );

  @observable
  private submitAttempted = false;

  readonly recalcCoordinator = new EvaluationCoordinator();

  constructor(questionnaire: Questionnaire, response?: QuestionnaireResponse) {
    makeObservable(this);

    this.questionnaire = questionnaire;
    this.initialResponse = response;

    runInAction(() => {
      this.initializeExpressionInfrastructure();

      if (questionnaire.item) {
        this.children.replace(
          questionnaire.item!.map((item) =>
            this.createNodeStore(
              item,
              null,
              this.scope,
              "",
              this.initialResponse?.item?.filter(
                ({ linkId }) => linkId === item.linkId,
              ),
            ),
          ),
        );
      }
    });
  }

  @computed
  get evaluationEnvironment(): EvaluationEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.questionnaire,
      context: this.expressionResponse,
    });
  }

  private initializeExpressionInfrastructure() {
    this.questionnaire.extension
      ?.filter((extension) => extension.url === EXT.SDC_VARIABLE)
      .map((extension) => extension.valueExpression)
      .filter(
        (expression): expression is Expression => expression !== undefined,
      )
      .forEach((expression) => this.createExpressionSlot(expression));
  }

  private createExpressionSlot(expression: Expression): IExpressionSlot {
    const slot: IExpressionSlot = new ExpressionSlot(
      this.recalcCoordinator,
      this,
      "variable",
      expression,
    );

    this.expressionSlots.push(slot);

    try {
      this.scope.registerExpression(slot);
    } catch (e) {
      if (e instanceof DuplicateExpressionNameError) {
        this.recordExpressionIssue(makeIssue("invalid", e.message));
      } else throw e;
    }

    return slot;
  }

  @action
  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INodeStore | null,
    scope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): INodeStore {
    switch (item.type) {
      case "display": {
        const store = new DisplayStore(
          this,
          item,
          parentStore,
          scope,
          parentKey,
        );
        scope.registerNode(store);
        return store;
      }
      case "group":
        if (item.repeats) {
          const store = new RepeatingGroupStore(
            this,
            item,
            parentStore,
            scope,
            parentKey,
            responseItems,
          );
          scope.registerNode(store);
          return store;
        } else {
          const store = new NonRepeatingGroupStore(
            this,
            item,
            parentStore,
            scope,
            parentKey,
            responseItems,
          );
          scope.registerNode(store);
          return store;
        }

      case "string":
      case "boolean":
      case "question":
      case "decimal":
      case "integer":
      case "date":
      case "dateTime":
      case "time":
      case "text":
      case "url":
      case "coding":
      case "attachment":
      case "reference":
      case "quantity": {
        const store = new QuestionStore(
          this,
          item,
          parentStore,
          scope,
          parentKey,
          responseItems,
        );
        scope.registerNode(store);
        return store;
      }
    }
  }

  @computed
  get isSubmitAttempted() {
    return this.submitAttempted;
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    return [...this.expressionIssues];
  }

  @action
  validateAll() {
    this.submitAttempted = true;
    // TODO: surface a form-level summary when validation fails.
    const isValid = !this.children.some((node) => this.nodeHasErrors(node));

    if (isValid) {
      this.submitAttempted = false;
    }

    return isValid;
  }

  @computed
  get response(): QuestionnaireResponse {
    const items = this.children.flatMap((node) => node.responseItems);
    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire:
        this.questionnaire.url || `Questionnaire/${this.questionnaire.id}`,
    };

    if (items.length > 0) {
      response.item = items;
    }

    return response;
  }

  @computed
  get expressionResponse(): QuestionnaireResponse {
    const items = this.children.flatMap((node) => node.expressionItems);
    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire:
        this.questionnaire.url || `Questionnaire/${this.questionnaire.id}`,
    };

    if (items.length > 0) {
      response.item = items;
    }

    return response;
  }

  @action
  reset() {
    this.submitAttempted = false;
    this.children.forEach((node) => this.clearNodeDirty(node));
  }

  private nodeHasErrors(node: INodeStore): boolean {
    if (node.hasErrors) {
      return true;
    }

    return this.getChildNodes(node).some((child) => this.nodeHasErrors(child));
  }

  private getChildNodes(node: INodeStore): INodeStore[] {
    if (node.type === "group") {
      return node.repeats
        ? node.instances.flatMap((instance) => instance.children)
        : node.children;
    }

    if (node.type === "display") {
      return [];
    }

    return node.answers.flatMap((answer) => answer.children);
  }

  private recordExpressionIssue(issue: OperationOutcomeIssue) {
    this.expressionIssues.push(issue);
  }

  private clearNodeDirty(node: INodeStore) {
    node.clearDirty();
    this.getChildNodes(node).forEach((child) => this.clearNodeDirty(child));
  }
}
