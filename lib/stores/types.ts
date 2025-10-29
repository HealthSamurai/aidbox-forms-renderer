import type {
  Attachment,
  Coding,
  Expression,
  OperationOutcomeIssue,
  Quantity,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
  Reference,
} from "fhir/r5";
import type { EvaluationCoordinator } from "./evaluation-coordinator.ts";

export type OperationOutcomeIssueCode =
  | "business-rule" // Expression cycles / logic conflicts (ExpressionSlot.setCycleDetected)
  | "invalid" // Failed evaluations or value constraint violations (ExpressionSlot/value validators)
  | "required" // Missing mandated content (QuestionStore/Group min-occurs checks)
  | "structure"; // Exceeding max-occurs limits (QuestionStore/Group max-occurs checks)

export type ExpressionSlotKind =
  | "variable"
  | "enable-when"
  | "initial"
  | "calculated"
  | "min-value"
  | "max-value";

export interface IExpressionSlot {
  readonly name?: string | undefined;
  readonly value: unknown;
  readonly error?: OperationOutcomeIssue | undefined;
  readonly kind: ExpressionSlotKind;

  setCycleDetected(cycle: readonly string[]): void;
  clearCycleDetected(): void;
  toString(): string;
}

export type EvaluationEnvironment = Record<string, unknown> &
  Record<"context", unknown>;

export interface IEvaluationEnvironmentProvider {
  evaluationEnvironment: EvaluationEnvironment;
}

export interface IScope {
  extend(ownsNodes: boolean): IScope;
  registerNode(node: INodeStore): void;
  lookupNode(linkId: string): INodeStore | undefined;
  registerExpression(slot: IExpressionSlot): void;
  lookupExpression(name: string): IExpressionSlot | undefined;
  listExpressions(): IterableIterator<[string, IExpressionSlot]>;
  getParentScope(): IScope | undefined;
  mergeEnvironment(initial: EvaluationEnvironment): EvaluationEnvironment;
}

export type AnswerType = Exclude<
  QuestionnaireItem["type"],
  "group" | "display" | "question"
>;

export type AnswerValueType<T extends AnswerType> =
  // prettier-ignore
  T extends "boolean"    ? boolean :
  T extends "decimal"    ? number  :
  T extends "integer"    ? number  :
  T extends "date"       ? string  :
  T extends "dateTime"   ? string  :
  T extends "time"       ? string  :
  T extends "string"     ? string  :
  T extends "text"       ? string  :
  T extends "url"        ? string  :
  T extends "coding"     ? Coding  :
  T extends "attachment" ? Attachment :
  T extends "reference"  ? Reference :
  T extends "quantity"   ? Quantity :
                           never;

export interface IBaseNodeStore {
  readonly template: QuestionnaireItem;

  /** Graph relations / infra */
  readonly form: IFormStore;
  readonly parentStore: INodeStore | null;
  readonly scope: IScope;
  readonly key: string;

  readonly linkId: string;
  readonly type: QuestionnaireItem["type"];
  readonly text: string | undefined;
  readonly prefix: string | undefined;
  readonly help: string | undefined;
  readonly required: boolean;
  readonly readOnly: boolean;
  readonly repeats: boolean;

  readonly hidden: boolean; // questionnaire-hidden
  readonly minOccurs: number; // minOccurs || (required ? 1 : 0)
  readonly maxOccurs: number | undefined; // maxOccurs
  readonly enableWhenExpression: Expression | undefined;
  readonly calculatedExpression: Expression | undefined;
  readonly initialExpression: Expression | undefined;
  readonly expressionItems: QuestionnaireResponseItem[];

  /** Runtime state */
  readonly isEnabled: boolean;
  readonly hasErrors: boolean;
  readonly issues: Array<OperationOutcomeIssue>;
  readonly isDirty: boolean;
  markDirty(): void;
  clearDirty(): void;

  readonly responseItems: QuestionnaireResponseItem[];
}

/** Display: leaf, text-only */
export interface IDisplayStore extends IBaseNodeStore {
  readonly type: "display";
}

/** Group base */
export interface IGroupBase extends IBaseNodeStore {
  readonly type: "group";

  /** Narrowing discriminator tied to QuestionnaireItem.repeats */
  readonly repeats: boolean;
}

/** Non-repeating Group: has live children, no instances */
export interface INonRepeatingGroupStore extends IGroupBase {
  readonly repeats: false;
  /** Only here: direct child items */
  children: Array<INodeStore>;
}

export interface IRepeatingGroupInstance {
  key: string;
  children: Array<INodeStore>;
  readonly responseItem: QuestionnaireResponseItem | null;
  readonly expressionItem: QuestionnaireResponseItem;
  readonly scope: IScope;
  remove(): void;
}

/** Repeating Group: has instances, no direct children */
export interface IRepeatingGroupStore extends IGroupBase {
  readonly repeats: true;
  /** Only here: one child array per group instance */
  instances: Array<IRepeatingGroupInstance>;

  /** Repeat controls */
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  addInstance(): void;
  removeInstance(index: number): void;
}

export type IGroupStore = INonRepeatingGroupStore | IRepeatingGroupStore;

/** One FHIR answer instance (for any question) */
export interface IAnswerInstance<TValue> {
  readonly key: string;
  value: TValue | null;
  children: Array<INodeStore>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | null;
  readonly expressionAnswer: QuestionnaireResponseItemAnswer | undefined;
  readonly scope: IScope;
}

/** Question: unified answers-first model */
export interface IQuestionStore<TType extends AnswerType = AnswerType>
  extends IBaseNodeStore {
  readonly type: TType;

  /** Unified answers: non-repeating → 0/1, repeating → 0..n */
  answers: Array<IAnswerInstance<AnswerValueType<TType>>>;

  readonly hasChildren: boolean;

  /** Guards (respect min/max occurs & repeats) */
  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(initial?: AnswerValueType<TType> | null): void;
  removeAnswer(index: number): void;
  setAnswer(index: number, value: AnswerValueType<TType> | null): void;
}

/** Union of all item variants used throughout the renderer */
export type INodeStore = IDisplayStore | IGroupStore | IQuestionStore;

/** ---------- Root store ---------- */
export interface IFormStore {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse | undefined;
  children: Array<INodeStore>;
  readonly expressionResponse: QuestionnaireResponse;
  readonly recalcCoordinator: EvaluationCoordinator;
  readonly scope: IScope;

  readonly isSubmitAttempted: boolean;
  readonly issues: Array<OperationOutcomeIssue>;
  validateAll(): boolean;

  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): INodeStore;
  reset(): void;
}
