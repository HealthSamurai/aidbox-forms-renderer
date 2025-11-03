import { action, computed, observable, override } from "mobx";
import {
  IPresentableNode,
  IForm,
  INode,
  IRepeatingGroupNode,
  IRepeatingGroupWrapper,
  IScope,
  SnapshotKind,
} from "./types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { AbstractPresentableNode } from "./abstract-presentable-node.ts";
import { RepeatingGroupStore } from "./repeating-group-store.ts";
import { RepeatingGroupWrapperValidator } from "./repeating-group-wrapper-validator.ts";
import { EXT, findExtension } from "../utils.ts";

export class RepeatingGroupWrapper
  extends AbstractPresentableNode
  implements IRepeatingGroupWrapper
{
  readonly scope: IScope;
  readonly key: string;

  @observable.shallow
  readonly nodes = observable.array<IRepeatingGroupNode>([], {
    deep: false,
    name: "RepeatingGroupWrapper.instances",
  });

  private readonly validator: RepeatingGroupWrapperValidator;

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

    this.validator = new RepeatingGroupWrapperValidator(this);

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
    return (
      findExtension(this.template, EXT.MAX_OCCURS)?.valueInteger ??
      Number.POSITIVE_INFINITY
    );
  }

  @computed
  get canAdd() {
    return !this.readOnly && this.nodes.length < this.maxOccurs;
  }

  @computed
  get canRemove() {
    return !this.readOnly && this.nodes.length > this.minOccurs;
  }

  @override
  override get hidden() {
    if (super.hidden) {
      return true;
    }

    return !this.nodes.some((instance) => !instance.hidden);
  }

  get isEnabled(): boolean {
    return this.parentStore?.isEnabled ?? true;
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
      const [removed] = this.nodes.splice(index, 1);
      removed?.dispose();
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

  @computed.struct
  get responseItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("response");
  }

  @computed.struct
  get expressionItems(): QuestionnaireResponseItem[] {
    return this.buildItemSnapshot("expression");
  }

  private buildItemSnapshot(kind: SnapshotKind): QuestionnaireResponseItem[] {
    if (kind === "response") {
      return this.nodes.flatMap((instance) => instance.responseItems);
    }

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
    return this.nodes.some((instance) => instance.hasErrors);
  }

  get issues(): OperationOutcomeIssue[] {
    return this.validator.issues;
  }

  override clearDirty(): void {}

  dispose(): void {
    const instances = this.nodes.slice();
    this.nodes.clear();
    instances.forEach((instance) => instance.dispose());
  }
}

export function isRepeatingGroupWrapper(
  it: IPresentableNode | undefined,
): it is IRepeatingGroupWrapper {
  return it instanceof RepeatingGroupWrapper;
}
