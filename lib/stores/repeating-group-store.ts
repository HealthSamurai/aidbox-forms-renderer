import {
  IFormStore,
  IScope,
  INodeStore,
  IRepeatingGroupInstance,
  IRepeatingGroupStore,
} from "./types.ts";
import { action, computed, observable } from "mobx";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";

import { AbstractNodeStore } from "./abstract-node-store.ts";
import { RepeatingGroupInstance } from "./repeating-group-instance.ts";
import { instanceHasResponses, makeIssue } from "../utils.ts";

export class RepeatingGroupStore
  extends AbstractNodeStore
  implements IRepeatingGroupStore
{
  constructor(
    form: IFormStore,
    template: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore, parentScope, parentKey);

    responseItems?.forEach((responseItem) => this.pushInstance(responseItem));
    this.ensureMinOccurs();
  }

  override get type() {
    return super.type as "group";
  }

  override get repeats() {
    return true as const;
  }

  @observable.shallow
  readonly instances = observable.array<IRepeatingGroupInstance>([], {
    deep: false,
    name: "RepeatingGroupStore.instances",
  });

  @computed
  get canAdd() {
    return this.maxOccurs == null || this.instances.length < this.maxOccurs;
  }

  @computed
  get canRemove() {
    return this.instances.length > this.minOccurs;
  }

  @action
  addInstance() {
    if (this.canAdd) {
      this.pushInstance();
      this.markDirty();
    }
  }

  @action
  removeInstance(index: number) {
    if (this.canRemove) {
      this.instances.splice(index, 1);
      this.markDirty();
    }
  }

  @action
  private pushInstance(responseItem?: QuestionnaireResponseItem) {
    const instance = new RepeatingGroupInstance(
      this,
      this.scope,
      this.instances.length,
      responseItem,
    );
    this.instances.push(instance);
  }

  @action
  private ensureMinOccurs() {
    while (this.instances.length < this.minOccurs && this.canAdd) {
      this.pushInstance();
    }
  }

  protected override computeIssues(): OperationOutcomeIssue[] {
    if (this.readOnly) {
      return [];
    }

    const occurs = this.instances.filter(instanceHasResponses).length;

    const issues: OperationOutcomeIssue[] = [];

    if (this.minOccurs > 0 && occurs < this.minOccurs) {
      issues.push(
        makeIssue(
          "required",
          `At least ${this.minOccurs} occurrence(s) required.`,
        ),
      );
    }

    if (this.maxOccurs != null && occurs > this.maxOccurs) {
      issues.push(
        makeIssue(
          "structure",
          `No more than ${this.maxOccurs} occurrence(s) permitted.`,
        ),
      );
    }

    return issues;
  }

  @computed
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    return this.instances
      .map((instance) => instance.responseItem)
      .filter((item): item is QuestionnaireResponseItem => item !== null);
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    if (this.instances.length === 0) {
      return [
        {
          linkId: this.linkId,
          text: this.text,
        },
      ];
    }

    return this.instances.map((instance) => instance.expressionItem);
  }
}
