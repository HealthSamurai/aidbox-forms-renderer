import type {
  AnswerType,
  IQuestionNode,
  QuestionControlDefinition,
} from "../../types.ts";
import { StringWidget } from "../../components/nodes/question/widgets/string-widget.tsx";
import { NumberWidget } from "../../components/nodes/question/widgets/number-widget.tsx";
import { DecimalWidget } from "../../components/nodes/question/widgets/decimal-widget.tsx";
import { DateWidget } from "../../components/nodes/question/widgets/date-widget.tsx";
import { DateTimeWidget } from "../../components/nodes/question/widgets/datetime-widget.tsx";
import { TimeWidget } from "../../components/nodes/question/widgets/time-widget.tsx";
import { QuantityWidget } from "../../components/nodes/question/widgets/quantity-widget.tsx";
import { CodingWidget } from "../../components/nodes/question/widgets/coding-widget.tsx";
import { ReferenceWidget } from "../../components/nodes/question/widgets/reference-widget.tsx";
import { AttachmentWidget } from "../../components/nodes/question/widgets/attachment-widget.tsx";
import { OptionListWidget } from "../../components/nodes/question/widgets/option-list-widget.tsx";
import { DropdownWidget } from "../../components/nodes/question/widgets/dropdown-widget.tsx";
import { LookupWidget } from "../../components/nodes/question/widgets/lookup-widget.tsx";
import { UnsupportedWidget } from "../../components/nodes/question/widgets/unsupported-widget.tsx";

type StringLikeType = Extract<AnswerType, "string" | "text">;
type DatalistType = Extract<
  AnswerType,
  "string" | "integer" | "decimal" | "date" | "dateTime" | "time" | "url"
>;
type HybridType = Extract<
  AnswerType,
  "quantity" | "coding" | "reference" | "text"
>;

export const defaultQuestionControlDefinitions: QuestionControlDefinition[] = [
  {
    name: "option-or-string",
    priority: 110,
    matcher: (node): node is IQuestionNode<StringLikeType> =>
      isStringLike(node) && node.options.constraint === "optionsOrString",
    component: DropdownWidget,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-datalist",
    priority: 100,
    matcher: (node): node is IQuestionNode<DatalistType> =>
      node.options.constraint === "optionsOrType" &&
      isDatalistType(node) &&
      hasOptions(node),
    component: DropdownWidget,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-hybrid",
    priority: 100,
    matcher: (node): node is IQuestionNode<HybridType> =>
      node.options.constraint === "optionsOrType" &&
      isHybridType(node) &&
      hasOptions(node),
    component: DropdownWidget,
  } as QuestionControlDefinition,
  {
    name: "options-list-control",
    priority: 95,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && usesListControl(node),
    component: OptionListWidget,
  } as QuestionControlDefinition,
  {
    name: "options-lookup",
    priority: 90,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && node.control === "lookup",
    component: LookupWidget,
  } as QuestionControlDefinition,
  {
    name: "options-autocomplete",
    priority: 85,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && node.control === "autocomplete",
    component: DropdownWidget,
  } as QuestionControlDefinition,
  {
    name: "options-select",
    priority: 80,
    matcher: (node): node is IQuestionNode => hasOptions(node),
    component: DropdownWidget,
  } as QuestionControlDefinition,
  {
    name: "boolean-primitive",
    priority: 20,
    matcher: (node): node is IQuestionNode<"boolean"> =>
      node.type === "boolean",
    component: OptionListWidget,
  } as QuestionControlDefinition,
  {
    name: "string-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"string"> => node.type === "string",
    component: StringWidget,
  } as QuestionControlDefinition,
  {
    name: "text-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"text"> => node.type === "text",
    component: StringWidget,
  } as QuestionControlDefinition,
  {
    name: "url-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"url"> => node.type === "url",
    component: StringWidget,
  } as QuestionControlDefinition,
  {
    name: "integer-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"integer"> =>
      node.type === "integer",
    component: NumberWidget,
  } as QuestionControlDefinition,
  {
    name: "decimal-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"decimal"> =>
      node.type === "decimal",
    component: DecimalWidget,
  } as QuestionControlDefinition,
  {
    name: "date-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"date"> => node.type === "date",
    component: DateWidget,
  } as QuestionControlDefinition,
  {
    name: "dateTime-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"dateTime"> =>
      node.type === "dateTime",
    component: DateTimeWidget,
  } as QuestionControlDefinition,
  {
    name: "time-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"time"> => node.type === "time",
    component: TimeWidget,
  } as QuestionControlDefinition,
  {
    name: "quantity-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"quantity"> =>
      node.type === "quantity",
    component: QuantityWidget,
  } as QuestionControlDefinition,
  {
    name: "coding-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"coding"> => node.type === "coding",
    component: CodingWidget,
  } as QuestionControlDefinition,
  {
    name: "reference-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"reference"> =>
      node.type === "reference",
    component: ReferenceWidget,
  } as QuestionControlDefinition,
  {
    name: "attachment-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"attachment"> =>
      node.type === "attachment",
    component: AttachmentWidget,
  } as QuestionControlDefinition,
  {
    name: "unsupported-question",
    priority: Number.NEGATIVE_INFINITY,
    matcher: (_node): _node is IQuestionNode => true,
    component: UnsupportedWidget,
  } as QuestionControlDefinition,
] as QuestionControlDefinition[];

function hasOptions(node: IQuestionNode) {
  return !!(
    node.template.answerOption?.length ||
    node.expressionRegistry.answer ||
    node.template.answerValueSet
  );
}

function usesListControl(node: IQuestionNode) {
  return node.control === "radio-button" || node.control === "check-box";
}

function isStringLike(
  node: IQuestionNode,
): node is IQuestionNode<StringLikeType> {
  return node.type === "string" || node.type === "text";
}

function isDatalistType(
  node: IQuestionNode,
): node is IQuestionNode<DatalistType> {
  return (
    node.type === "string" ||
    node.type === "integer" ||
    node.type === "decimal" ||
    node.type === "date" ||
    node.type === "dateTime" ||
    node.type === "time" ||
    node.type === "url"
  );
}

function isHybridType(node: IQuestionNode): node is IQuestionNode<HybridType> {
  return (
    node.type === "quantity" ||
    node.type === "coding" ||
    node.type === "reference" ||
    node.type === "text"
  );
}

export class QuestionControlRegistry {
  private definitions: QuestionControlDefinition[];

  constructor(initialDefinitions: QuestionControlDefinition[] = []) {
    this.definitions = this.sortDefinitions(initialDefinitions);
  }

  register(...definitions: QuestionControlDefinition[]): void {
    this.definitions = this.sortDefinitions([
      ...this.definitions,
      ...definitions,
    ]);
  }

  unregister(name: string): void {
    this.definitions = this.definitions.filter(
      (definition) => definition.name !== name,
    );
  }

  resolve(node: IQuestionNode): QuestionControlDefinition | undefined {
    return this.definitions.find((definition) => definition.matcher(node));
  }

  list(): QuestionControlDefinition[] {
    return [...this.definitions];
  }

  private sortDefinitions(
    definitions: QuestionControlDefinition[],
  ): QuestionControlDefinition[] {
    return [...definitions].sort((a, b) => b.priority - a.priority);
  }
}
