import { IFormStore, INodeScope, INodeStore } from "./types.ts";
import { action, computed, makeObservable, observable } from "mobx";
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { QuestionStore } from "./question-store.ts";
import { NonRepeatingGroupStore } from "./non-repeating-group-store.ts";
import { DisplayStore } from "./display-store.ts";
import { RepeatingGroupStore } from "./repeating-group-store.ts";

export class FormStore implements IFormStore {
  questionnaire: Questionnaire;
  private readonly initialResponse: QuestionnaireResponse | undefined;

  @observable.shallow
  readonly nodes = observable.array<INodeStore>([], { deep: false });

  @observable.shallow
  private readonly registry = observable.map<string, INodeStore>(
    {},
    { deep: false },
  );

  @observable
  private submitAttempted = false;

  context: Record<string, unknown> = {};

  constructor(questionnaire: Questionnaire, response?: QuestionnaireResponse) {
    makeObservable(this);

    this.questionnaire = questionnaire;
    this.initialResponse = response;

    if (questionnaire.item) {
      this.nodes.replace(
        questionnaire.item.map((item) =>
          this.createNodeStore(
            item,
            null,
            this,
            "",
            this.initialResponse?.item?.filter(
              ({ linkId }) => linkId === item.linkId,
            ),
          ),
        ),
      );
    }
  }

  @action
  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: INodeScope,
    parentPath: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): INodeStore {
    switch (item.type) {
      case "display": {
        const store = new DisplayStore(
          this,
          item,
          parentStore,
          parentScope,
          parentPath,
        );
        parentScope.registerStore(store);
        return store;
      }
      case "group":
        if (item.repeats) {
          const store = new RepeatingGroupStore(
            this,
            item,
            parentStore,
            parentScope,
            parentPath,
            responseItems,
          );
          parentScope.registerStore(store);
          return store;
        } else {
          const store = new NonRepeatingGroupStore(
            this,
            item,
            parentStore,
            parentScope,
            parentPath,
            responseItems,
          );
          parentScope.registerStore(store);
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
          parentScope,
          parentPath,
          responseItems,
        );
        parentScope.registerStore(store);
        return store;
      }
    }
  }

  lookupStore(linkId: string) {
    return this.registry.get(linkId);
  }

  @action
  registerStore(node: INodeStore) {
    this.registry.set(node.linkId, node);
  }

  @computed
  get isSubmitAttempted() {
    return this.submitAttempted;
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

  @computed
  get response(): QuestionnaireResponse {
    const items = this.nodes.flatMap((node) => node.responseItems);
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
    this.nodes.forEach((node) => this.clearNodeDirty(node));
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

  private clearNodeDirty(node: INodeStore) {
    node.clearDirty();
    this.getChildNodes(node).forEach((child) => this.clearNodeDirty(child));
  }
}
