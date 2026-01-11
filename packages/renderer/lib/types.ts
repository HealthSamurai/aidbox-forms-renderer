import {
  Address,
  Age,
  Annotation,
  Attachment,
  Availability,
  CodeableConcept,
  CodeableReference,
  Coding,
  ContactDetail,
  ContactPoint,
  Count,
  DataRequirement,
  Distance,
  Dosage,
  Duration,
  Expression,
  ExtendedContactDetail,
  HumanName,
  Identifier,
  Meta,
  Money,
  OperationOutcomeIssue,
  ParameterDefinition,
  Period,
  Quantity,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
  Range,
  Ratio,
  RatioRange,
  Reference,
  RelatedArtifact,
  SampledData,
  Signature,
  Timing,
  TriggerDefinition,
  UsageContext,
} from "fhir/r5";
import type { GroupRendererRegistry } from "./store/group/group-renderer-registry.ts";
import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { QuestionRendererRegistry } from "./store/question/question-renderer-registry.ts";
import { PolyCarrierFor, PolyKeyFor } from "./utilities.ts";
import type { FormPagination, OptionItem } from "@aidbox-forms/theme";

export type OperationOutcomeIssueCode =
  | "business-rule" // Expression cycles / logic conflicts
  | "invalid" // Failed evaluations or value constraint violations
  | "required" // Missing mandated content
  | "structure"; // Exceeding max-occurs limits

export const ITEM_CONTROLS = [
  // display
  "inline",
  "prompt",
  "unit",
  "lower",
  "upper",
  "flyover",
  "help",
  "legal",

  // group
  "list",
  "table",
  "htable",
  "gtable",
  "grid",
  "header",
  "footer",
  "page",
  "tab-container",

  // question
  "autocomplete",
  "drop-down",
  "check-box",
  "lookup",
  "radio-button",
  "slider",
  "spinner",
  "text-box",
] as const;

export type ItemControl = (typeof ITEM_CONTROLS)[number];

export const GROUP_ITEM_CONTROLS = [
  "list",
  "table",
  "htable",
  "gtable",
  "grid",
  "header",
  "footer",
  "page",
  "tab-container",
] as const;

export type GroupItemControl = (typeof GROUP_ITEM_CONTROLS)[number];

export const QUESTION_ITEM_CONTROLS = [
  "autocomplete",
  "drop-down",
  "check-box",
  "lookup",
  "radio-button",
  "slider",
  "spinner",
  "text-box",
] as const;

export type QuestionItemControl = (typeof QUESTION_ITEM_CONTROLS)[number];

export type ExpressionSlotKind =
  | "variable"
  | "enable-when"
  | "initial"
  | "calculated"
  | "answer"
  | "answer-option-toggle"
  | "min-value"
  | "max-value"
  | "min-occurs"
  | "max-occurs"
  | "constraint"
  | "min-quantity"
  | "max-quantity"
  | "required"
  | "text"
  | "read-only"
  | "repeats";

export interface IEvaluationCoordinator {
  trackEvaluation<T>(slot: IExpressionSlot, run: () => T): T;
  trackWrite(slot: IExpressionSlot, commit: () => boolean): void;
}
export interface IExpressionRegistry {
  readonly registrationIssues: OperationOutcomeIssue[];
  readonly slotsIssues: OperationOutcomeIssue[];
  readonly constraintsIssues: OperationOutcomeIssue[];
}

export interface AnswerOptionToggleDefinition {
  readonly slot: IExpressionSlot;
  readonly options: ReadonlyArray<QuestionnaireItemAnswerOption>;
}

export interface INodeExpressionRegistry extends IExpressionRegistry {
  readonly enableWhen: IExpressionSlot | undefined;
  readonly initial: IExpressionSlot | undefined;
  readonly calculated: IExpressionSlot | undefined;
  readonly answer: IExpressionSlot | undefined;
  readonly minValue: IExpressionSlot | undefined;
  readonly maxValue: IExpressionSlot | undefined;
  readonly maxQuantity: IExpressionSlot | undefined;
  readonly minQuantity: IExpressionSlot | undefined;
  readonly minOccurs: IExpressionSlot | undefined;
  readonly maxOccurs: IExpressionSlot | undefined;
  readonly required: IExpressionSlot | undefined;

  readonly text: IExpressionSlot | undefined;
  readonly readOnly: IExpressionSlot | undefined;
  readonly repeats: IExpressionSlot | undefined;

  readonly answerOptionToggles: ReadonlyArray<AnswerOptionToggleDefinition>;
}

export interface IExpressionSlot {
  readonly name?: string | undefined;
  readonly value: unknown; // todo: make a universal normalization function for the value
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
  registerNode(node: IPresentableNode): void;
  lookupNode(linkId: string): IPresentableNode | undefined;
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

export type AnswerToken = string;
export type OptionToken = string;

export type EnableWhenAnswer =
  | boolean
  | number
  | string
  | Coding
  | Quantity
  | Reference
  | undefined;

export type AnswerLifecycle =
  | "pristine"
  | "template"
  | "response"
  | "expression"
  | "manual";

export type AnswerOption<T extends AnswerType> = {
  readonly token: OptionToken;
  readonly value: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
  readonly disabled: boolean;
  readonly answerType: AnswerType;
};

export type ValueDisplayProperties<T extends AnswerType> = {
  value: DataTypeToType<AnswerTypeToDataType<T>>;
};

export type ValueDisplayComponent<T extends AnswerType> = ComponentType<
  ValueDisplayProperties<T>
>;

export type ValueControlProperties<T extends AnswerType> = {
  answer: IAnswer<T>;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
};

export type DataType =
  | "base64Binary"
  | "boolean"
  | "canonical"
  | "code"
  | "date"
  | "dateTime"
  | "decimal"
  | "id"
  | "instant"
  | "integer"
  | "integer64"
  | "markdown"
  | "oid"
  | "positiveInt"
  | "string"
  | "time"
  | "unsignedInt"
  | "uri"
  | "url"
  | "uuid"
  | "Address"
  | "Age"
  | "Annotation"
  | "Attachment"
  | "CodeableConcept"
  | "CodeableReference"
  | "Coding"
  | "ContactPoint"
  | "Count"
  | "Distance"
  | "Duration"
  | "HumanName"
  | "Identifier"
  | "Money"
  | "Period"
  | "Quantity"
  | "Range"
  | "Ratio"
  | "RatioRange"
  | "Reference"
  | "SampledData"
  | "Signature"
  | "Timing"
  | "ContactDetail"
  | "DataRequirement"
  | "Expression"
  | "ParameterDefinition"
  | "RelatedArtifact"
  | "TriggerDefinition"
  | "UsageContext"
  | "Availability"
  | "ExtendedContactDetail"
  | "Dosage"
  | "Meta";

export type AnswerTypeToDataType<T extends AnswerType> =
  // prettier-ignore
  T extends "boolean"    ? "boolean"    :
  T extends "decimal"    ? "decimal"    :
  T extends "integer"    ? "integer"    :
  T extends "date"       ? "date"       :
  T extends "dateTime"   ? "dateTime"   :
  T extends "time"       ? "time"       :
  T extends "string"     ? "string"     :
  T extends "text"       ? "string"     :
  T extends "url"        ? "uri"        :
  T extends "coding"     ? "Coding"     :
  T extends "attachment" ? "Attachment" :
  T extends "reference"  ? "Reference"  :
  T extends "quantity"   ? "Quantity"   :
                           never;

export type DataTypeToType<T extends DataType> =
  // prettier-ignore
  T extends "base64Binary"          ? string :
  T extends "boolean"               ? boolean  :
  T extends "canonical"             ? string  :
  T extends "code"                  ? string  :
  T extends "date"                  ? string  :
  T extends "dateTime"              ? string  :
  T extends "decimal"               ? number  :
  T extends "id"                    ? string  :
  T extends "instant"               ? string  :
  T extends "integer"               ? number  :
  T extends "integer64"             ? string :
  T extends "markdown"              ? string :
  T extends "oid"                   ? string :
  T extends "positiveInt"           ? number :
  T extends "string"                ? string :
  T extends "time"                  ? string :
  T extends "unsignedInt"           ? number :
  T extends "uri"                   ? string :
  T extends "url"                   ? string :
  T extends "uuid"                  ? string :
  T extends "Address"               ? Address :
  T extends "Age"                   ? Age :
  T extends "Annotation"            ? Annotation :
  T extends "Attachment"            ? Attachment :
  T extends "CodeableConcept"       ? CodeableConcept :
  T extends "CodeableReference"     ? CodeableReference :
  T extends "Coding"                ? Coding :
  T extends "ContactPoint"          ? ContactPoint :
  T extends "Count"                 ? Count :
  T extends "Distance"              ? Distance :
  T extends "Duration"              ? Duration :
  T extends "HumanName"             ? HumanName :
  T extends "Identifier"            ? Identifier :
  T extends "Money"                 ? Money :
  T extends "Period"                ? Period :
  T extends "Quantity"              ? Quantity :
  T extends "Range"                 ? Range :
  T extends "Ratio"                 ? Ratio :
  T extends "RatioRange"            ? RatioRange :
  T extends "Reference"             ? Reference :
  T extends "SampledData"           ? SampledData :
  T extends "Signature"             ? Signature :
  T extends "Timing"                ? Timing :
  T extends "ContactDetail"         ? ContactDetail :
  T extends "DataRequirement"       ? DataRequirement :
  T extends "Expression"            ? Expression :
  T extends "ParameterDefinition"   ? ParameterDefinition :
  T extends "RelatedArtifact"       ? RelatedArtifact :
  T extends "TriggerDefinition"     ? TriggerDefinition :
  T extends "UsageContext"          ? UsageContext :
  T extends "Availability"          ? Availability :
  T extends "ExtendedContactDetail" ? ExtendedContactDetail :
  T extends "Dosage"                ? Dosage :
  T extends "Meta"                  ? Meta :
                                    never;

// prettier-ignore
export type DataTypeToSuffix<T extends DataType> =
  T extends "base64Binary"          ? "Base64Binary"          :
  T extends "boolean"               ? "Boolean"               :
  T extends "canonical"             ? "Canonical"             :
  T extends "code"                  ? "Code"                  :
  T extends "date"                  ? "Date"                  :
  T extends "dateTime"              ? "DateTime"              :
  T extends "decimal"               ? "Decimal"               :
  T extends "id"                    ? "Id"                    :
  T extends "instant"               ? "Instant"               :
  T extends "integer"               ? "Integer"               :
  T extends "integer64"             ? "Integer64"             :
  T extends "markdown"              ? "Markdown"              :
  T extends "oid"                   ? "Oid"                   :
  T extends "positiveInt"           ? "PositiveInt"           :
  T extends "string"                ? "String"                :
  T extends "time"                  ? "Time"                  :
  T extends "unsignedInt"           ? "UnsignedInt"           :
  T extends "uri"                   ? "Uri"                   :
  T extends "url"                   ? "Url"                   :
  T extends "uuid"                  ? "Uuid"                  :
  T extends "Address"               ? "Address"               :
  T extends "Age"                   ? "Age"                   :
  T extends "Annotation"            ? "Annotation"            :
  T extends "Attachment"            ? "Attachment"            :
  T extends "CodeableConcept"       ? "CodeableConcept"       :
  T extends "CodeableReference"     ? "CodeableReference"     :
  T extends "Coding"                ? "Coding"                :
  T extends "ContactPoint"          ? "ContactPoint"          :
  T extends "Count"                 ? "Count"                 :
  T extends "Distance"              ? "Distance"              :
  T extends "Duration"              ? "Duration"              :
  T extends "HumanName"             ? "HumanName"             :
  T extends "Identifier"            ? "Identifier"            :
  T extends "Money"                 ? "Money"                 :
  T extends "Period"                ? "Period"                :
  T extends "Quantity"              ? "Quantity"              :
  T extends "Range"                 ? "Range"                 :
  T extends "Ratio"                 ? "Ratio"                 :
  T extends "RatioRange"            ? "RatioRange"            :
  T extends "Reference"             ? "Reference"             :
  T extends "SampledData"           ? "SampledData"           :
  T extends "Signature"             ? "Signature"             :
  T extends "Timing"                ? "Timing"                :
  T extends "ContactDetail"         ? "ContactDetail"         :
  T extends "DataRequirement"       ? "DataRequirement"       :
  T extends "Expression"            ? "Expression"            :
  T extends "ParameterDefinition"   ? "ParameterDefinition"   :
  T extends "RelatedArtifact"       ? "RelatedArtifact"       :
  T extends "TriggerDefinition"     ? "TriggerDefinition"     :
  T extends "UsageContext"          ? "UsageContext"          :
  T extends "Availability"          ? "Availability"          :
  T extends "ExtendedContactDetail" ? "ExtendedContactDetail" :
  T extends "Dosage"                ? "Dosage"                :
  T extends "Meta"                  ? "Meta"                  :
                                    never;

export type SnapshotKind = "response" | "expression";

export interface IPresentableNode {
  readonly template: QuestionnaireItem;

  readonly form: IForm;
  readonly scope: IScope;
  readonly token: string;
  readonly parentStore: INode | undefined;

  readonly linkId: string;
  readonly text: string | undefined;
  readonly prefix: string | undefined;
  readonly help: string | undefined;
  readonly legal: string | undefined;
  readonly placeholder: string | undefined;
  readonly flyover: string | undefined;
  readonly upper: string | undefined;
  readonly lower: string | undefined;
  readonly required: boolean;
  readonly readOnly: boolean;
  readonly hidden: boolean;
  readonly unitDisplay: string | undefined;
  readonly unitOptions: ReadonlyArray<Coding>;
  readonly isEnabled: boolean;
  readonly preferredTerminologyServers: ReadonlyArray<string>;

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

export interface IActualNode extends IPresentableNode {
  readonly minOccurs: number;
  readonly maxOccurs: number;
  readonly expressionRegistry: INodeExpressionRegistry;
  readonly isHeaderless: boolean;

  readonly isDirty: boolean;
}

export type GroupRendererProperties = { node: IGroupNode | IGroupList };

export type GroupRendererMatcher = (target: IGroupNode | IGroupList) => boolean;

export interface GroupRendererDefinition {
  name: string;
  priority: number;
  matcher: GroupRendererMatcher;
  renderer: ComponentType<GroupRendererProperties>;
}

export interface IGroupRow {
  group: IGroupNode;
  questions: Array<IQuestionNode | undefined>;
}

export interface IGrid {
  readonly columns: Array<IQuestionNode>;
  readonly rows: Array<IGroupRow>;
}

export type OptionAxisItem = Omit<AnswerOption<AnswerType>, "disabled">;

export type TableCellState = {
  selected: boolean;
  disabled: boolean;
};

export interface ITable {
  readonly questions: Array<IQuestionNode>;
  readonly optionAxis: Array<OptionAxisItem>;
  getCellState(
    question: IQuestionNode,
    optionToken: OptionToken,
  ): TableCellState | undefined;
  toggleCell(question: IQuestionNode, optionToken: OptionToken): void;
}

export interface IGroupNode extends IActualNode {
  readonly nodes: Array<IPresentableNode>;
  readonly visibleNodes: Array<IPresentableNode>;
  readonly control: GroupItemControl | undefined;
  readonly renderer: ComponentType<GroupRendererProperties> | undefined;
  readonly grid: IGrid;
  readonly table: ITable;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDisplayNode extends IActualNode {}

export interface IGroupList extends IPresentableNode {
  readonly nodes: Array<IGroupNode>;
  readonly visibleNodes: Array<IGroupNode>;
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number;
  readonly control: GroupItemControl | undefined;
  readonly renderer: ComponentType<GroupRendererProperties> | undefined;
  readonly grid: IGrid;
  addNode(): void;
  removeNode(node: IGroupNode): void;
}

export interface ValueBounds<T extends AnswerType = AnswerType> {
  readonly min: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
  readonly max: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
}

export interface IAnswer<T extends AnswerType = AnswerType> {
  readonly token: AnswerToken;
  readonly question: IQuestionNode<T>;
  readonly value: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
  setValueByUser(value?: DataTypeToType<AnswerTypeToDataType<T>>): void;
  setValueBySystem(value?: DataTypeToType<AnswerTypeToDataType<T>>): void;
  readonly nodes: Array<IPresentableNode>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | undefined;
  readonly expressionAnswer: QuestionnaireResponseItemAnswer | undefined;
  readonly scope: IScope;
  readonly issues: Array<OperationOutcomeIssue>;
  readonly bounds: ValueBounds<T>;
  readonly quantity: IQuantityAnswer;
  dispose(): void;
}

export interface IQuantityAnswer {
  readonly entries: ReadonlyArray<OptionItem>;
  readonly unitToken: string;
  readonly isUnitFreeForm: boolean;
  handleNumberInput(raw: string): void;
  handleSelectChange(token: string): void;
  handleFreeTextChange(text: string): void;
}

export interface IOptionSelection<T extends AnswerType = AnswerType> {
  readonly isLoading: boolean;
  readonly customType: AnswerType;
  readonly allowCustom: boolean;
  readonly filteredOptions: ReadonlyArray<
    AnswerOption<T> | AnswerOption<"string">
  >;
  readonly selectedOptions: ReadonlyArray<SelectedAnswerOption<T>>;
  readonly specifyOtherToken: OptionToken;
  readonly canAddSelection: boolean;
  readonly customOptionFormState: CustomOptionFormState<T> | undefined;
  getSelectedOption(answer: IAnswer<T>): SelectedAnswerOption<T> | undefined;
  setSearchQuery(query: string): void;
  selectOption(token: OptionToken): void;
  deselectOption(token: OptionToken): void;
  selectOptionForAnswer(
    answer: IAnswer<T>,
    token: OptionToken | undefined,
  ): void;
  cancelCustomOptionForm(): void;
  submitCustomOptionForm(): void;
}

export interface IAnswerOptions<T extends AnswerType = AnswerType> {
  readonly error: OperationOutcomeIssue | undefined;
  readonly inherentOptions: ReadonlyArray<AnswerOption<T>>;
  readonly constraint: QuestionnaireItem["answerConstraint"];
  readonly select: IOptionSelection<T>;
}

export type QuestionRendererProperties<T extends AnswerType = AnswerType> = {
  node: IQuestionNode<T>;
};

export type QuestionRendererComponent<T extends AnswerType = AnswerType> = {
  bivarianceHack(
    properties: QuestionRendererProperties<T>,
  ): ReactNode | Promise<ReactNode>;
}["bivarianceHack"];

export interface QuestionRendererDefinition<T extends AnswerType = AnswerType> {
  name: string;
  priority: number;
  matcher: (node: IQuestionNode) => boolean;
  renderer: QuestionRendererComponent<T>;
}

export type CustomOptionFormState<T extends AnswerType> = {
  answer: IAnswer<T>;
  isNew: boolean;
  canSubmit: boolean;
};

export type SelectedAnswerOption<T extends AnswerType> = {
  answer: IAnswer<T>;
} & (AnswerOption<T> | AnswerOption<"string">);

export interface IQuestionNode<
  T extends AnswerType = AnswerType,
> extends IActualNode {
  readonly type: T;
  readonly dataType: AnswerTypeToDataType<T>;
  readonly control: QuestionItemControl | undefined;
  readonly repeats: boolean;
  readonly isRepeatingWithoutChildren: boolean;
  readonly answerOption: IAnswerOptions<T>;
  readonly keyboardType: HTMLAttributes<Element>["inputMode"] | undefined;
  readonly answers: Array<IAnswer<T>>;
  readonly renderer: QuestionRendererComponent<T> | undefined;
  readonly minLength: number | undefined;
  readonly maxLength: number | undefined;
  readonly maxDecimalPlaces: number | undefined;
  readonly mimeTypes: readonly string[];
  readonly maxSize: number | undefined;

  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(
    initial?: DataTypeToType<AnswerTypeToDataType<T>> | undefined,
  ): IAnswer | undefined;
  removeAnswer(answer: IAnswer<T>): void;
  markUserOverridden(): void;
}

export type INode = IDisplayNode | IGroupList | IGroupNode | IQuestionNode;

export interface INodeValidator {
  readonly issues: Array<OperationOutcomeIssue>;
  // readonly bounds;
}

export type ExpansionCache = Map<string, Promise<Coding[]>>;

export interface IValueSetExpander {
  expand(
    canonical: string,
    preferredServers: ReadonlyArray<string>,
  ): Promise<Coding[]>;
}

export interface IForm {
  questionnaire: Questionnaire;
  response: QuestionnaireResponse | undefined;
  nodes: Array<IPresentableNode>;
  readonly headerNodes: Array<IGroupNode>;
  readonly footerNodes: Array<IGroupNode>;
  readonly contentNodes: Array<IPresentableNode>;
  readonly pagination: FormPagination | undefined;
  readonly expressionResponse: QuestionnaireResponse;
  readonly coordinator: IEvaluationCoordinator;
  readonly expressionRegistry: IExpressionRegistry;
  readonly scope: IScope;
  readonly valueSetExpander: IValueSetExpander;
  readonly preferredTerminologyServers: ReadonlyArray<string>;
  readonly questionRendererRegistry: QuestionRendererRegistry;
  readonly groupRendererRegistry: GroupRendererRegistry;
  reportRenderingIssue(issue: OperationOutcomeIssue): void;

  readonly isSubmitAttempted: boolean;
  readonly issues: Array<OperationOutcomeIssue>;
  validateAll(): boolean;

  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | undefined,
    parentScope: IScope,
    parentToken: string,
    responseItems: QuestionnaireResponseItem[] | undefined,
  ): IPresentableNode;
  reset(): void;
  dispose(): void;
}

export interface TargetConstraintDefinition {
  key: string | undefined;
  severity: "error" | "warning" | undefined;
  human: string | undefined;
  expression: Expression | undefined;
  location: string | undefined;
  requirements: string | undefined;
}

export type ValueKeyFor<T extends DataType> = PolyKeyFor<"value", T>;

export type ValueCarrierFor<T extends DataType> = PolyCarrierFor<"value", T>;

export { type SelectedOptionItem, type OptionItem } from "@aidbox-forms/theme";
