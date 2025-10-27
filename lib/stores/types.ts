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

export interface INodeScope {
  registerStore(node: INodeStore): void;
  lookupStore(linkId: string): INodeStore | undefined;
}

export type AnswerableQuestionType = Exclude<
  QuestionnaireItem["type"],
  "group" | "display" | "question"
>;

export type AnswerValueFor<T extends AnswerableQuestionType> =
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

export interface IBaseNodeStore extends INodeScope {
  readonly template: QuestionnaireItem;

  /** Graph relations / infra */
  readonly form: IFormStore;
  readonly parentStore: INodeStore | null;
  readonly parentScope: INodeScope;
  readonly path: string; // e.g., "A/0/B"

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

export interface IRepeatingGroupInstance extends INodeScope {
  path: string;
  children: Array<INodeStore>;
  readonly responseItem: QuestionnaireResponseItem | null;
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
export interface IAnswerInstance<TValue> extends INodeScope {
  readonly key: string;
  path: string;
  value: TValue | null;
  children: Array<INodeStore>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | null;
}

/** Question: unified answers-first model */
export interface IQuestionStore<
  TType extends AnswerableQuestionType = AnswerableQuestionType,
> extends IBaseNodeStore {
  readonly type: TType;

  /** Unified answers: non-repeating → 0/1, repeating → 0..n */
  answers: Array<IAnswerInstance<AnswerValueFor<TType>>>;

  readonly hasChildren: boolean;

  /** Guards (respect min/max occurs & repeats) */
  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(initial?: AnswerValueFor<TType> | null): void;
  removeAnswer(index: number): void;
  setAnswer(index: number, value: AnswerValueFor<TType> | null): void;
}

/** Union of all item variants used throughout the renderer */
export type INodeStore = IDisplayStore | IGroupStore | IQuestionStore;

/** ---------- Root store ---------- */
export interface IFormStore extends INodeScope {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse | undefined;
  nodes: Array<INodeStore>;

  readonly isSubmitAttempted: boolean;
  validateAll(): boolean;

  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INodeStore | null,
    parentScope: INodeScope,
    parentPath: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): INodeStore;
  reset(): void;
}
