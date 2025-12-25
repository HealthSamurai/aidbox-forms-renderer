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
import type { GroupControlRegistry } from "./stores/registries/group-control-registry.ts";
import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { QuestionControlRegistry } from "./stores/registries/question-control-registry.ts";
import { PolyCarrierFor, PolyKeyFor } from "./utils.ts";

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

export type AnswerOptionEntry<T extends AnswerType> = {
  key: string;
  label: string;
  value: DataTypeToType<AnswerTypeToDataType<T>> | null;
  option: QuestionnaireItemAnswerOption;
  disabled: boolean;
};

export type ValueDisplayProps<T extends AnswerType> = {
  value: DataTypeToType<AnswerTypeToDataType<T>>;
};

export type ValueDisplayComponent<T extends AnswerType> = ComponentType<
  ValueDisplayProps<T>
>;

export type ValueControlProps<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  inputId: string;
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
  readonly key: string;
  readonly parentStore: INode | null;

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

  readonly isDirty: boolean;
}

export type GroupControlProps = {
  node: IGroupNode;
};

export type GroupWrapperControlProps = {
  wrapper: IGroupWrapper;
};

export type GroupControlMatcher = (
  target: IGroupNode | IGroupWrapper,
) => boolean;

export interface GroupControlDefinition {
  name: string;
  priority: number;
  matcher: GroupControlMatcher;
  groupComponent?: ComponentType<GroupControlProps>;
  wrapperComponent?: ComponentType<GroupWrapperControlProps>;
}

type GridColumnState = {
  key: string;
  label: string;
};

type GridCellState = {
  key: string;
  question?: IQuestionNode | undefined;
};

type GridRowState = {
  key: string;
  label: string;
  cells: Array<GridCellState>;
};

export interface IGridStore {
  readonly columns: Array<GridColumnState>;
  readonly rows: Array<GridRowState>;
  readonly emptyMessage: string | null;
}

type TableColumnState = {
  key: string;
  label: string;
};

type TableCellState = {
  key: string;
  entry: AnswerOptionEntry<AnswerType> | undefined;
  placeholder?: string;
  selected: boolean;
  disabled: boolean;
  toggleSelection?: () => void;
};

type TableRowState = {
  key: string;
  question: IQuestionNode;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  id: string;
  selectedKey: string;
  selectedKeys: Set<string>;
  cells: Array<TableCellState>;
  hasDetails: boolean;
};

export interface ITableStore {
  readonly questions: Array<IQuestionNode>;
  readonly others: Array<IPresentableNode>;
  readonly columns: Array<TableColumnState>;
  readonly rowStates: Array<TableRowState>;
  readonly detailQuestions: Array<IQuestionNode>;
}

type GridTableColumnState = {
  key: string;
  label: string;
};

type GridTableCellState = {
  key: string;
  question?: IQuestionNode | undefined;
  action?: "remove" | undefined;
};

type GridTableRowState = {
  key: string;
  label: string;
  node: IGroupNode;
  cells: Array<GridTableCellState>;
};

export interface IGridTableStore {
  readonly gridColumns: Array<GridTableColumnState>;
  readonly rows: Array<GridTableRowState>;
}

export interface IGroupNode extends IActualNode {
  readonly nodes: Array<IPresentableNode>;
  readonly visibleNodes: Array<IPresentableNode>;
  readonly control: GroupItemControl | undefined;
  readonly renderer: GroupControlDefinition["groupComponent"] | undefined;
  readonly gridStore: IGridStore;
  readonly tableStore: ITableStore;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDisplayNode extends IActualNode {}

export interface IGroupWrapper extends IPresentableNode {
  readonly nodes: Array<IGroupNode>;
  readonly visibleNodes: Array<IGroupNode>;
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number;
  readonly control: GroupItemControl | undefined;
  readonly renderer: GroupControlDefinition["wrapperComponent"] | undefined;
  readonly gridTableStore: IGridTableStore;
  addNode(): void;
  removeNode(instance: IGroupNode): void;
}

export interface ValueBounds<T extends AnswerType = AnswerType> {
  readonly min: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
  readonly max: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
}

export interface IAnswerInstance<T extends AnswerType = AnswerType> {
  readonly key: string;
  readonly question: IQuestionNode<T>;
  readonly value: DataTypeToType<AnswerTypeToDataType<T>> | null;
  setValueByUser(value: DataTypeToType<AnswerTypeToDataType<T>> | null): void;
  setValueBySystem(value: DataTypeToType<AnswerTypeToDataType<T>> | null): void;
  readonly nodes: Array<IPresentableNode>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | null;
  readonly expressionAnswer: QuestionnaireResponseItemAnswer | null;
  readonly scope: IScope;
  readonly issues: Array<OperationOutcomeIssue>;
  readonly bounds: ValueBounds<T>;
  readonly quantity: IQuantityAnswer;
  dispose(): void;
}
export type UnitOptionEntry = {
  key: string;
  label: string;
  disabled: boolean;
};

export interface IQuantityAnswer {
  readonly entries: ReadonlyArray<UnitOptionEntry>;
  readonly displayUnitKey: string;
  readonly isUnitFreeForm: boolean;
  handleNumberInput(raw: string): void;
  handleSelectChange(key: string): void;
  handleFreeTextChange(text: string): void;
}

export interface IAnswerOptions<T extends AnswerType = AnswerType> {
  readonly loading: boolean;
  readonly error: string | null;
  readonly entries: ReadonlyArray<AnswerOptionEntry<T>>;
  readonly constraint: QuestionnaireItem["answerConstraint"];
  getKeyForValue(value: DataTypeToType<AnswerTypeToDataType<T>> | null): string;
  getValueForKey(key: string): DataTypeToType<AnswerTypeToDataType<T>> | null;
  getLegacyEntryForValue(
    answerKey: string,
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): { key: string; label: string } | null;
}

export type QuestionRendererProps<T extends AnswerType = AnswerType> = {
  node: IQuestionNode<T>;
};

type QuestionRendererComponent<T extends AnswerType = AnswerType> = {
  bivarianceHack(
    props: QuestionRendererProps<T>,
  ): ReactNode | Promise<ReactNode>;
}["bivarianceHack"];

export interface QuestionControlDefinition<T extends AnswerType = AnswerType> {
  name: string;
  priority: number;
  matcher: (node: IQuestionNode) => boolean;
  renderer: QuestionRendererComponent<T>;
}

type SelectCheckboxOption<T extends AnswerType> = {
  key: string;
  label: string;
  value: AnswerOptionEntry<T>["value"];
  disabled: boolean;
};

type SelectCheckboxState<T extends AnswerType> = {
  options: ReadonlyArray<AnswerOptionEntry<T>>;
  uiOptions: Array<SelectCheckboxOption<T>>;
  selectedKeys: Set<string>;
  answerByKey: Map<string, IAnswerInstance<T>>;
  nonOptionAnswers: IAnswerInstance<T>[];
  customAnswers: IAnswerInstance<T>[];
  availableAnswers: IAnswerInstance<T>[];
  canAddSelection: boolean;
  isCustomActive: boolean;
  specifyOthersKey: string;
};

type SelectChipItem<T extends AnswerType> = {
  key: string;
  answer: IAnswerInstance<T>;
  inlineString: boolean;
  kind: "option" | "custom";
};

type SelectDialogState<T extends AnswerType> = {
  answer: IAnswerInstance<T>;
  isNew: boolean;
  canConfirm: boolean;
};

type ListSelectRowState = {
  isCustomActive: boolean;
  radioOptions: Array<{ key: string; label: string; disabled?: boolean }>;
  selectValue: string;
  legacyOption: { key: string; label: string } | null;
  handleChange: (key: string) => void;
};

type DropdownRowState<T extends AnswerType> = {
  optionKey: string;
  extendedOptions: ReadonlyArray<AnswerOptionEntry<T>>;
  isCustomActive: boolean;
  exitCustom: () => void;
  handleSelect: (key: string) => void;
  selectValue: string;
  legacyOption: { key: string; label: string } | null;
  canClear: boolean;
  clearValue: () => void;
};

export interface ISelectStore<T extends AnswerType = AnswerType> {
  readonly useCheckboxes: boolean;
  readonly isMultiSelect: boolean;
  readonly allowCustom: boolean;
  readonly isLoading: boolean;
  readonly checkboxState: SelectCheckboxState<T>;
  readonly selectedChipItems: Array<SelectChipItem<T>>;
  readonly customChipItems: Array<SelectChipItem<T>>;
  readonly hasCustomAction: boolean;
  readonly specifyOtherKey: string;
  readonly canAddSelection: boolean;
  readonly canRemoveSelection: boolean;
  readonly hasSelections: boolean;
  readonly dialogState: SelectDialogState<T> | null;
  readonly extendedOptions: ReadonlyArray<AnswerOptionEntry<T>>;
  readonly selectValue: string;
  readonly ariaLabelledBy: string;
  readonly ariaDescribedBy: string | undefined;

  handleCheckboxToggle(key: string): void;
  getListRowState(answer: IAnswerInstance<T>): ListSelectRowState;
  getDropdownRowState(answer: IAnswerInstance<T>): DropdownRowState<T>;
  handleSelectOption(key: string): void;
  handleSelectChange(key: string): void;
  handleRemoveAnswer(answer: IAnswerInstance<T>): void;
  handleClearAll(): void;
  cancelCustomDialog(): void;
  confirmCustomDialog(): void;
  buildRowProps(
    answer: IAnswerInstance<T>,
    suffix: string,
  ): ValueControlProps<T>;
}

export interface IQuestionNode<
  T extends AnswerType = AnswerType,
> extends IActualNode {
  readonly type: T;
  readonly control: QuestionItemControl | undefined;
  readonly repeats: boolean;
  readonly options: IAnswerOptions<T>;
  readonly selectStore: ISelectStore<T>;
  readonly keyboardType: HTMLAttributes<Element>["inputMode"] | undefined;
  readonly answers: Array<IAnswerInstance<T>>;
  readonly renderer: QuestionControlDefinition["renderer"] | undefined;

  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(
    initial?: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): IAnswerInstance | undefined;
  removeAnswer(answer: IAnswerInstance<T>): void;
  markUserOverridden(): void;
}

export type INode =
  | IDisplayNode
  | IGroupNode
  | IGroupWrapper
  | IGroupNode
  | IQuestionNode;

export interface INodeValidator {
  readonly issues: Array<OperationOutcomeIssue>;
  // readonly bounds;
}

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
  readonly expressionResponse: QuestionnaireResponse;
  readonly coordinator: IEvaluationCoordinator;
  readonly expressionRegistry: IExpressionRegistry;
  readonly scope: IScope;
  readonly valueSetExpander: IValueSetExpander;
  readonly preferredTerminologyServers: ReadonlyArray<string>;
  readonly questionControlRegistry: QuestionControlRegistry;
  readonly groupControlRegistry: GroupControlRegistry;
  reportRenderingIssue(issue: OperationOutcomeIssue): void;

  readonly isSubmitAttempted: boolean;
  readonly issues: Array<OperationOutcomeIssue>;
  validateAll(): boolean;

  createNodeStore(
    item: QuestionnaireItem,
    parentStore: INode | null,
    parentScope: IScope,
    parentKey: string,
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
