import { action, computed, observable, override } from "mobx";
import {
  IPresentableNode,
  IForm,
  INode,
  IGroupNode,
  IRepeatingGroupWrapper,
  IScope,
  SnapshotKind,
  GROUP_ITEM_CONTROLS,
  type GroupItemControl,
  type GroupControlDefinition,
} from "../../../types.ts";
import {
  OperationOutcomeIssue,
  QuestionnaireItem,
  QuestionnaireResponseItem,
} from "fhir/r5";
import { AbstractPresentableNode } from "../base/abstract-presentable-node.ts";
import { RepeatingGroupWrapperValidator } from "../../validation/repeating-group-wrapper-validator.ts";
import {
  EXT,
  findExtension,
  getItemControlCode,
  makeIssue,
  withQuestionnaireResponseItemMeta,
} from "../../../utils.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { GroupStore } from "./group-store.ts";

export class RepeatingGroupWrapper
  extends AbstractPresentableNode
  implements IRepeatingGroupWrapper
{
  readonly scope: IScope;
  readonly key: string;

  @observable.shallow
  readonly nodes = observable.array<IGroupNode>([], {
    deep: false,
    name: "RepeatingGroupWrapper.nodes",
  });

  @computed
  get visibleNodes(): IGroupNode[] {
    return this.nodes.filter((node) => !node.hidden);
  }

  private readonly validator: RepeatingGroupWrapperValidator;

  private lastIndex = 0;

  constructor(
    form: IForm,
    template: QuestionnaireItem,
    parentStore: INode | null,
    scope: IScope,
    key: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ) {
    super(form, template, parentStore);

    this.scope = scope;
    this.key = key;

    this.validator = new RepeatingGroupWrapperValidator(this);

    responseItems?.forEach((responseItem) => this.pushNode(responseItem));
    this.ensureMinOccurs();
    this.enforceControlRules();
  }

  @computed
  get component(): GroupControlDefinition["wrapperComponent"] | undefined {
    return this.form.groupControlRegistry.resolveRepeating(this)
      ?.wrapperComponent;
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
  get control(): GroupItemControl | undefined {
    const control = getItemControlCode(this.template);
    return control && GROUP_ITEM_CONTROLS.includes(control as GroupItemControl)
      ? (control as GroupItemControl)
      : undefined;
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

    return !this.nodes.some((node) => !node.hidden);
  }

  @computed
  protected get _isEnabled() {
    return true;
  }

  @computed
  protected get _readOnly(): boolean {
    return !!this.template.readOnly;
  }

  @action
  addNode() {
    if (this.canAdd) {
      this.pushNode();
    }
  }

  @action
  removeNode(node: IGroupNode) {
    if (this.canRemove) {
      const index = this.nodes.indexOf(node);
      if (index !== -1) {
        const [removed] = this.nodes.splice(index, 1);
        removed?.dispose();
      }
    }
  }

  @action
  private pushNode(responseItem?: QuestionnaireResponseItem) {
    const node = new GroupStore(
      this.form,
      this.template,
      this,
      this.scope.extend(true),
      `${this.key}_/_${this.lastIndex++}`,
      responseItem,
    );
    this.nodes.push(node);
  }

  @action
  private ensureMinOccurs() {
    while (this.nodes.length < this.minOccurs && this.canAdd) {
      this.pushNode();
    }
  }

  private enforceControlRules() {
    const control = this.control;
    if (!control) {
      return;
    }

    if (
      (control === "header" || control === "footer" || control === "page") &&
      this.parentStore
    ) {
      this.form.reportRenderingIssue(
        makeIssue(
          "structure",
          `Repeating group "${this.linkId}" with control '${control}' must be a top-level item.`,
        ),
      );
    }

    if (control === "header" || control === "footer") {
      this.form.reportRenderingIssue(
        makeIssue(
          "structure",
          `Repeating group "${this.linkId}" cannot use control '${control}' because these sections cannot repeat.`,
        ),
      );
    }

    if (control === "gtable") {
      this.nodes.forEach((node) => {
        node.nodes.forEach((node) => {
          if (!isQuestionNode(node)) {
            this.form.reportRenderingIssue(
              makeIssue(
                "structure",
                `Gtable group "${this.linkId}" expects only question items, but child "${node.linkId}" is type '${node.template.type}'.`,
              ),
            );
            return;
          }

          if (node.repeats) {
            this.form.reportRenderingIssue(
              makeIssue(
                "structure",
                `Question "${node.linkId}" inside gtable group "${this.linkId}" must not allow multiple answers.`,
              ),
            );
          }
        });
      });
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
      return this.nodes.flatMap((node) => node.responseItems);
    }

    if (this.nodes.length === 0) {
      return [
        withQuestionnaireResponseItemMeta({
          linkId: this.linkId,
          text: kind === "expression" ? this.template.text : this.text,
        }),
      ];
    }

    return this.nodes
      .map((node) => node.expressionItems.at(0))
      .filter((item): item is QuestionnaireResponseItem => item !== undefined);
  }

  override markDirty(): void {
    this.parentStore?.markDirty?.();
  }

  override get hasErrors(): boolean {
    return this.nodes.some((node) => node.hasErrors);
  }

  get issues(): OperationOutcomeIssue[] {
    return this.validator.issues;
  }

  override clearDirty(): void {}

  @action
  dispose(): void {
    const nodes = this.nodes.slice();
    this.nodes.clear();
    nodes.forEach((node) => node.dispose());
  }
}

export function isRepeatingGroupWrapper(
  it: IPresentableNode | undefined | null,
): it is IRepeatingGroupWrapper {
  return it instanceof RepeatingGroupWrapper;
}

export function assertRepeatingGroupWrapper(
  it: IPresentableNode | undefined | null,
  message?: string,
): asserts it is IRepeatingGroupWrapper {
  if (!isRepeatingGroupWrapper(it)) {
    throw new Error(message ?? "Expected RepeatingGroupWrapper instance");
  }
}
