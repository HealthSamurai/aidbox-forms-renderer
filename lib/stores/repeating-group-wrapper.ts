import { action, computed, observable } from "mobx";
import {
  ICoreNode,
  IForm,
  INode,
  IRepeatingGroupNode,
  IRepeatingGroupWrapper,
  IScope,
} from "./types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { CoreAbstractNode } from "./core-abstract-node.ts";
import { RepeatingGroupStore } from "./repeating-group-store.ts";
import {
  EXT,
  findExtension,
  instanceHasResponses,
  makeIssue,
} from "../utils.ts";

export class RepeatingGroupWrapper
  extends CoreAbstractNode
  implements IRepeatingGroupWrapper
{
  readonly scope: IScope;
  readonly key: string;
  readonly isEnabled = true;

  @observable.shallow
  readonly nodes = observable.array<IRepeatingGroupNode>([], {
    deep: false,
    name: "RepeatingGroupWrapper.instances",
  });

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore);

    this.scope = parentScope.extend(false);
    this.key = `${parentKey}_/_${this.template.linkId}`;

    responseItems?.forEach((responseItem) => this.pushInstance(responseItem));
    this.ensureMinOccurs();
  }

  @computed
  get minOccurs() {
    return (
      findExtension(this.template, EXT.MIN_OCCURS)?.valueInteger ??
      (this.template.required ? 1 : 0)
    );
  }

  @computed
  get maxOccurs() {
    return findExtension(this.template, EXT.MAX_OCCURS)?.valueInteger;
  }

  @computed
  get canAdd() {
    return this.maxOccurs == null || this.nodes.length < this.maxOccurs;
  }

  @computed
  get canRemove() {
    return this.nodes.length > this.minOccurs;
  }

  @action
  addInstance() {
    if (this.canAdd) {
      this.pushInstance();
    }
  }

  @action
  removeInstance(index: number) {
    if (this.canRemove) {
      this.nodes.splice(index, 1);
    }
  }

  @action
  private pushInstance(responseItem?: QuestionnaireResponseItem) {
    const instance = new RepeatingGroupStore(
      this,
      this.nodes.length,
      responseItem,
    );
    this.nodes.push(instance);
  }

  @action
  private ensureMinOccurs() {
    while (this.nodes.length < this.minOccurs && this.canAdd) {
      this.pushInstance();
    }
  }

  @computed
  get responseItems(): QuestionnaireResponseItem[] {
    return this.nodes.flatMap((instance) => instance.responseItems);
  }

  @computed
  get expressionItems(): QuestionnaireResponseItem[] {
    if (this.nodes.length === 0) {
      return [{ linkId: this.linkId, text: this.text }];
    }

    return this.nodes
      .map((instance) => instance.expressionItems.at(0))
      .filter((item): item is QuestionnaireResponseItem => item !== undefined);
  }

  override markDirty(): void {
    this.parentStore?.markDirty?.();
  }

  override get hasErrors(): boolean {
    return false;
  }

  get issues(): OperationOutcomeIssue[] {
    if (this.readOnly) {
      return [];
    }

    const occurs = this.nodes.filter(instanceHasResponses).length;

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

  override clearDirty(): void {}
}

export function isRepeatingGroupWrapper(
  it: ICoreNode | undefined,
): it is IRepeatingGroupWrapper {
  return it instanceof RepeatingGroupWrapper;
}
