import type {
  Attachment,
  Coding,
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
import { ExpressionRegistry } from "./expression-registry.ts";

export type OperationOutcomeIssueCode =
  | "business-rule" // Expression cycles / logic conflicts
  | "invalid" // Failed evaluations or value constraint violations
  | "required" // Missing mandated content
  | "structure"; // Exceeding max-occurs limits

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

export type ExpressionEnvironment = Record<string, unknown> &
  Record<"context", unknown>;

export interface IExpressionEnvironmentProvider {
  expressionEnvironment: ExpressionEnvironment;
}

export interface IScope {
  extend(ownsNodes: boolean): IScope;
  registerNode(node: ICoreNode): void;
  lookupNode(linkId: string): ICoreNode | undefined;
  registerExpression(slot: IExpressionSlot): void;
  lookupExpression(name: string): IExpressionSlot | undefined;
  listExpressions(): IterableIterator<[string, IExpressionSlot]>;
  getParentScope(): IScope | undefined;
  mergeEnvironment(initial: ExpressionEnvironment): ExpressionEnvironment;
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

export type SnapshotKind = "response" | "expression";

export interface ICoreNode {
  readonly template: QuestionnaireItem;

  readonly form: IForm;
  readonly scope: IScope;
  readonly key: string;
  readonly parentStore: INode | null;

  readonly linkId: string;
  readonly text: string | undefined;
  readonly prefix: string | undefined;
  readonly help: string | undefined;
  readonly required: boolean;
  readonly readOnly: boolean;
  readonly hidden: boolean;
  readonly unitDisplay: string | undefined;
  readonly unitOptions: ReadonlyArray<Coding>;
  readonly isEnabled: boolean;

  readonly hasErrors: boolean;
  markDirty(): void;
  clearDirty(): void;

  // Represents only enabled, populated response items so
  // hidden/disabled nodes never leak into the saved QuestionnaireResponse.
  readonly responseItems: QuestionnaireResponseItem[];
  // Preserves full structural context (including disabled shells) so
  // FHIRPath expressions always evaluate against a predictable tree.
  readonly expressionItems: QuestionnaireResponseItem[];
  readonly issues: Array<OperationOutcomeIssue>;
  dispose(): void;
}

export interface IBaseNode extends ICoreNode {
  readonly readOnly: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number | undefined;
  readonly expressionRegistry: ExpressionRegistry | undefined;

  readonly isDirty: boolean;
}

export interface INonRepeatingGroupNode extends IBaseNode {
  nodes: Array<ICoreNode>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDisplayNode extends IBaseNode {}

export interface IRepeatingGroupNode extends IBaseNode {
  readonly index: number;
  readonly nodes: Array<ICoreNode>;
  readonly expressionIssues: Array<OperationOutcomeIssue>;
  remove(): void;
}

export interface IRepeatingGroupWrapper extends ICoreNode {
  readonly nodes: Array<IRepeatingGroupNode>;
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number;
  addInstance(): void;
  removeInstance(index: number): void;
}

export type IGroupNode = IRepeatingGroupNode | INonRepeatingGroupNode;

export interface IAnswerInstance<TValue> {
  readonly key: string;
  value: TValue | null;
  readonly nodes: Array<ICoreNode>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | null;
  readonly expressionAnswer: QuestionnaireResponseItemAnswer | null;
  readonly scope: IScope;
  readonly issues: Array<OperationOutcomeIssue>;
  dispose(): void;
}

export interface IQuestionNode<TType extends AnswerType = AnswerType>
  extends IBaseNode {
  readonly type: TType;
  readonly repeats: boolean;

  answers: Array<IAnswerInstance<AnswerValueType<TType>>>;

  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(initial?: AnswerValueType<TType> | null): void;
  removeAnswer(index: number): void;
  setAnswer(index: number, value: AnswerValueType<TType> | null): void;
}

export type INode =
  | IDisplayNode
  | INonRepeatingGroupNode
  | IRepeatingGroupWrapper
  | IRepeatingGroupNode
  | IQuestionNode;

export interface INodeValidator {
  readonly issues: Array<OperationOutcomeIssue>;
}

export interface IForm {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse | undefined;
  nodes: Array<ICoreNode>;
  readonly expressionResponse: QuestionnaireResponse;
  readonly coordinator: EvaluationCoordinator;
  readonly expressionRegistry: ExpressionRegistry;
  readonly scope: IScope;

  readonly isSubmitAttempted: boolean;
  readonly issues: Array<OperationOutcomeIssue>;
  validateAll(): boolean;

  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): ICoreNode;
  reset(): void;
  dispose(): void;
}
