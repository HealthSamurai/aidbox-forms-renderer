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
import type { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import { ExpressionRegistry } from "./expression-registry.ts";
import type { HTMLAttributes } from "react";

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
  | "answer"
  | "min-value"
  | "max-value"
  | "constraint"
  | "min-quantity"
  | "max-quantity"
  | "text"
  | "readonly"
  | "repeats";


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

export interface IActualNode extends IPresentableNode {
  readonly readOnly: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number | undefined;
  readonly expressionRegistry: ExpressionRegistry | undefined;

  readonly isDirty: boolean;
}

export interface INonRepeatingGroupNode extends IActualNode {
  nodes: Array<IPresentableNode>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDisplayNode extends IActualNode {}

export interface IRepeatingGroupNode extends IActualNode {
  readonly index: number;
  readonly nodes: Array<IPresentableNode>;
  readonly expressionIssues: Array<OperationOutcomeIssue>;
  remove(): void;
}

export interface IRepeatingGroupWrapper extends IPresentableNode {
  readonly nodes: Array<IRepeatingGroupNode>;
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  readonly minOccurs: number;
  readonly maxOccurs: number;
  addInstance(): void;
  removeInstance(index: number): void;
}

export type IGroupNode = IRepeatingGroupNode | INonRepeatingGroupNode;

export interface IAnswerInstance<T> {
  readonly key: string;
  value: T | null;
  readonly nodes: Array<IPresentableNode>;
  readonly responseAnswer: QuestionnaireResponseItemAnswer | null;
  readonly expressionAnswer: QuestionnaireResponseItemAnswer | null;
  readonly scope: IScope;
  readonly issues: Array<OperationOutcomeIssue>;
  dispose(): void;
}

export interface IQuestionNode<T extends AnswerType = AnswerType>
  extends IActualNode {
  readonly type: T;
  readonly repeats: boolean;
  readonly answerOptions: ReadonlyArray<QuestionnaireItemAnswerOption>;
  readonly keyboardType: HTMLAttributes<Element>["inputMode"] | undefined;

  answers: Array<IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>>;

  readonly canAdd: boolean;
  readonly canRemove: boolean;

  addAnswer(initial?: DataTypeToType<AnswerTypeToDataType<T>> | null): void;
  removeAnswer(index: number): void;
  setAnswer(
    index: number,
    value: DataTypeToType<AnswerTypeToDataType<T>> | null,
  ): void;
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
  nodes: Array<IPresentableNode>;
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
