import {
  ExpressionEnvironment,
  ICoreNode,
  IExpressionEnvironmentProvider,
  IForm,
  INode,
  IScope,
  SnapshotKind,
} from "./types.ts";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import {
  OperationOutcomeIssue,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { isQuestionNode, QuestionStore } from "./question-store.ts";
import {
  isNonRepeatingGroupNode,
  NonRepeatingGroupStore,
} from "./non-repeating-group-store.ts";
import { DisplayStore } from "./display-store.ts";
import {
  isRepeatingGroupWrapper,
  RepeatingGroupWrapper,
} from "./repeating-group-wrapper.ts";
import { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import { Scope } from "./scope.ts";
import { ExpressionRegistry } from "./expression-registry.ts";
import { shouldCreateStore } from "../utils.ts";

export class FormStore implements IForm, IExpressionEnvironmentProvider {
  questionnaire: Questionnaire;
  private readonly initialResponse: QuestionnaireResponse | undefined;

  @observable.shallow
  readonly nodes = observable.array<ICoreNode>([], {
    deep: false,
    name: "FormStore.children",
  });

  readonly scope = new Scope(true);

  @observable
  private submitAttempted = false;

  readonly coordinator = new EvaluationCoordinator();
  readonly expressionRegistry: ExpressionRegistry;

  constructor(questionnaire: Questionnaire, response?: QuestionnaireResponse) {
    makeObservable(this);

    this.questionnaire = questionnaire;
    this.initialResponse = response;

    this.expressionRegistry = new ExpressionRegistry(
      this.coordinator,
      this.scope,
      this,
      [
        ...(questionnaire.extension ?? []),
        ...(questionnaire.modifierExtension ?? []),
      ],
    );

    runInAction(() => {
      this.nodes.replace(
        (questionnaire.item ?? [])
          .filter(shouldCreateStore)
          .map((item) =>
            this.createNodeStore(
              item,
              null,
              this.scope,
              "",
              this.initialResponse?.item,
            ),
          ),
      );
    });
  }

  @computed
  get expressionEnvironment(): ExpressionEnvironment {
    return this.scope.mergeEnvironment({
      questionnaire: this.questionnaire,
      context: this.expressionResponse,
    });
  }

  @action
  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): ICoreNode {
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
          const store = new RepeatingGroupWrapper(
            this,
            item,
            parentStore,
            scope,
            parentKey,
            responseItems?.filter(({ linkId }) => linkId === item.linkId),
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
            responseItems?.find(({ linkId }) => linkId === item.linkId),
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
          responseItems?.find(({ linkId }) => linkId === item.linkId),
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
    return [...this.expressionRegistry.issues];
  }

  @action
  validateAll() {
    this.submitAttempted = true;
    // TODO: surface a form-level summary when validation fails.
    const isValid = !this.nodes.some((node) => this.nodeHasErrors(node));

    if (isValid) {
      this.submitAttempted = false;
    }

    return isValid;
  }

  @computed.struct
  get response(): QuestionnaireResponse {
    return this.buildResponseSnapshot("response");
  }

  @computed.struct
  get expressionResponse(): QuestionnaireResponse {
    return this.buildResponseSnapshot("expression");
  }

  @action
  reset() {
    this.submitAttempted = false;
    this.nodes.forEach((node) => this.clearNodeDirty(node));
  }

  private nodeHasErrors(node: ICoreNode): boolean {
    if (node.hasErrors) {
      return true;
    }

    return this.getChildNodes(node).some((child) => this.nodeHasErrors(child));
  }

  private getChildNodes(node: ICoreNode): ICoreNode[] {
    if (isRepeatingGroupWrapper(node)) {
      return node.nodes.flatMap((instance) => instance.nodes);
    }
    if (isNonRepeatingGroupNode(node)) {
      return node.nodes;
    }
    if (isQuestionNode(node)) {
      return node.answers.flatMap((answer) => answer.nodes);
    }
    return [];
  }

  private clearNodeDirty(node: ICoreNode) {
    node.clearDirty();
    this.getChildNodes(node).forEach((child) => this.clearNodeDirty(child));
  }

  private buildResponseSnapshot(
    kind: SnapshotKind,
  ): QuestionnaireResponse {
    const items =
      kind === "response"
        ? this.nodes.flatMap((node) => node.responseItems)
        : this.nodes.flatMap((node) => node.expressionItems);

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
}
