import type {
  AnswerType,
  IQuestionNode,
  QuestionControlDefinition,
} from "../../types.ts";
import { StringRenderer } from "../../components/nodes/question/renderers/string-renderer.tsx";
import { NumberRenderer } from "../../components/nodes/question/renderers/number-renderer.tsx";
import { DecimalRenderer } from "../../components/nodes/question/renderers/decimal-renderer.tsx";
import { DateRenderer } from "../../components/nodes/question/renderers/date-renderer.tsx";
import { DateTimeRenderer } from "../../components/nodes/question/renderers/datetime-renderer.tsx";
import { TimeRenderer } from "../../components/nodes/question/renderers/time-renderer.tsx";
import { QuantityRenderer } from "../../components/nodes/question/renderers/quantity-renderer.tsx";
import { CodingRenderer } from "../../components/nodes/question/renderers/coding-renderer.tsx";
import { ReferenceRenderer } from "../../components/nodes/question/renderers/reference-renderer.tsx";
import { AttachmentRenderer } from "../../components/nodes/question/renderers/attachment-renderer.tsx";
import { ListSelectRenderer } from "../../components/nodes/question/renderers/list-select-renderer.tsx";
import { DropdownRenderer } from "../../components/nodes/question/renderers/dropdown-renderer.tsx";
import { LookupRenderer } from "../../components/nodes/question/renderers/lookup-renderer.tsx";
import { UnsupportedRenderer } from "../../components/nodes/question/renderers/unsupported-renderer.tsx";

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
    component: DropdownRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-datalist",
    priority: 100,
    matcher: (node): node is IQuestionNode<DatalistType> =>
      node.options.constraint === "optionsOrType" &&
      isDatalistType(node) &&
      hasOptions(node),
    component: DropdownRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-hybrid",
    priority: 100,
    matcher: (node): node is IQuestionNode<HybridType> =>
      node.options.constraint === "optionsOrType" &&
      isHybridType(node) &&
      hasOptions(node),
    component: DropdownRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-list-control",
    priority: 95,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && usesListControl(node),
    component: ListSelectRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-lookup",
    priority: 90,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && node.control === "lookup",
    component: LookupRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-autocomplete",
    priority: 85,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && node.control === "autocomplete",
    component: DropdownRenderer,
  } as QuestionControlDefinition,
  {
    name: "options-select",
    priority: 80,
    matcher: (node): node is IQuestionNode => hasOptions(node),
    component: DropdownRenderer,
  } as QuestionControlDefinition,
  {
    name: "boolean-primitive",
    priority: 20,
    matcher: (node): node is IQuestionNode<"boolean"> =>
      node.type === "boolean",
    component: ListSelectRenderer,
  } as QuestionControlDefinition,
  {
    name: "string-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"string"> => node.type === "string",
    component: StringRenderer,
  } as QuestionControlDefinition,
  {
    name: "text-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"text"> => node.type === "text",
    component: StringRenderer,
  } as QuestionControlDefinition,
  {
    name: "url-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"url"> => node.type === "url",
    component: StringRenderer,
  } as QuestionControlDefinition,
  {
    name: "integer-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"integer"> =>
      node.type === "integer",
    component: NumberRenderer,
  } as QuestionControlDefinition,
  {
    name: "decimal-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"decimal"> =>
      node.type === "decimal",
    component: DecimalRenderer,
  } as QuestionControlDefinition,
  {
    name: "date-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"date"> => node.type === "date",
    component: DateRenderer,
  } as QuestionControlDefinition,
  {
    name: "dateTime-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"dateTime"> =>
      node.type === "dateTime",
    component: DateTimeRenderer,
  } as QuestionControlDefinition,
  {
    name: "time-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"time"> => node.type === "time",
    component: TimeRenderer,
  } as QuestionControlDefinition,
  {
    name: "quantity-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"quantity"> =>
      node.type === "quantity",
    component: QuantityRenderer,
  } as QuestionControlDefinition,
  {
    name: "coding-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"coding"> => node.type === "coding",
    component: CodingRenderer,
  } as QuestionControlDefinition,
  {
    name: "reference-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"reference"> =>
      node.type === "reference",
    component: ReferenceRenderer,
  } as QuestionControlDefinition,
  {
    name: "attachment-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"attachment"> =>
      node.type === "attachment",
    component: AttachmentRenderer,
  } as QuestionControlDefinition,
  {
    name: "unsupported-question",
    priority: Number.NEGATIVE_INFINITY,
    matcher: (_node): _node is IQuestionNode => true,
    component: UnsupportedRenderer,
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
