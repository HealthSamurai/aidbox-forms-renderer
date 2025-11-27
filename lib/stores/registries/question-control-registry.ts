import type {
  AnswerType,
  IQuestionNode,
  QuestionControlDefinition,
} from "../../types.ts";
import { StringQuestionControl } from "../../components/nodes/question/controls/string-question-control.tsx";
import { TextQuestionControl } from "../../components/nodes/question/controls/text-question-control.tsx";
import { IntegerQuestionControl } from "../../components/nodes/question/controls/integer-question-control.tsx";
import { DecimalQuestionControl } from "../../components/nodes/question/controls/decimal-question-control.tsx";
import { DateQuestionControl } from "../../components/nodes/question/controls/date-question-control.tsx";
import { DateTimeQuestionControl } from "../../components/nodes/question/controls/date-time-question-control.tsx";
import { TimeQuestionControl } from "../../components/nodes/question/controls/time-question-control.tsx";
import { UrlQuestionControl } from "../../components/nodes/question/controls/url-question-control.tsx";
import { BooleanQuestionControl } from "../../components/nodes/question/controls/boolean-question-control.tsx";
import { QuantityQuestionControl } from "../../components/nodes/question/controls/quantity-question-control.tsx";
import { CodingQuestionControl } from "../../components/nodes/question/controls/coding-question-control.tsx";
import { ReferenceQuestionControl } from "../../components/nodes/question/controls/reference-question-control.tsx";
import { AttachmentQuestionControl } from "../../components/nodes/question/controls/attachment-question-control.tsx";
import { OptionsOrStringQuestionControl } from "../../components/nodes/question/controls/options-or-string-question-control.tsx";
import { OptionsOrTypeDatalistQuestionControl } from "../../components/nodes/question/controls/options-or-type-datalist-question-control.tsx";
import { OptionsOrTypeHybridQuestionControl } from "../../components/nodes/question/controls/options-or-type-hybrid-question-control.tsx";
import { RadioQuestionControl } from "../../components/nodes/question/controls/radio-question-control.tsx";
import { AutocompleteQuestionControl } from "../../components/nodes/question/controls/autocomplete-question-control.tsx";
import { SelectQuestionControl } from "../../components/nodes/question/controls/select-question-control.tsx";
import { SliderQuestionControl } from "../../components/nodes/question/controls/slider-question-control.tsx";
import { SpinnerQuestionControl } from "../../components/nodes/question/controls/spinner-question-control.tsx";
import { CheckboxListQuestionControl } from "../../components/nodes/question/controls/checkbox-list-question-control.tsx";
import { UnsupportedQuestionControl } from "../../components/nodes/question/controls/unsupported-question-control.tsx";

type StringLikeType = Extract<AnswerType, "string" | "text">;
type NumericType = Extract<AnswerType, "integer" | "decimal">;
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
    priority: 100,
    matcher: (node): node is IQuestionNode<StringLikeType> =>
      isStringLike(node) && node.options.constraint === "optionsOrString",
    component: OptionsOrStringQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-radio-single",
    priority: 95,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) && usesListControl(node) && !node.repeats,
    component: RadioQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-radio-repeating-with-children",
    priority: 95,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) &&
      usesListControl(node) &&
      node.repeats &&
      questionHasChildren(node),
    component: RadioQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-checkbox-repeating",
    priority: 95,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) &&
      usesListControl(node) &&
      node.repeats &&
      !questionHasChildren(node),
    component: CheckboxListQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "numeric-slider-control",
    priority: 90,
    matcher: (node): node is IQuestionNode<NumericType> =>
      isNumeric(node) && node.control === "slider",
    component: SliderQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "numeric-spinner-control",
    priority: 90,
    matcher: (node): node is IQuestionNode<NumericType> =>
      isNumeric(node) && node.control === "spinner",
    component: SpinnerQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-autocomplete",
    priority: 90,
    matcher: (node): node is IQuestionNode =>
      hasOptions(node) &&
      (node.control === "autocomplete" || node.control === "lookup"),
    component: AutocompleteQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-datalist",
    priority: 80,
    matcher: (node): node is IQuestionNode<DatalistType> =>
      node.options.constraint === "optionsOrType" &&
      isDatalistType(node) &&
      hasOptions(node),
    component: OptionsOrTypeDatalistQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-or-type-hybrid",
    priority: 80,
    matcher: (node): node is IQuestionNode<HybridType> =>
      node.options.constraint === "optionsOrType" &&
      isHybridType(node) &&
      hasOptions(node),
    component: OptionsOrTypeHybridQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "options-select",
    priority: 50,
    matcher: (node): node is IQuestionNode => hasOptions(node),
    component: SelectQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "string-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"string"> => node.type === "string",
    component: StringQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "text-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"text"> => node.type === "text",
    component: TextQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "integer-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"integer"> =>
      node.type === "integer",
    component: IntegerQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "decimal-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"decimal"> =>
      node.type === "decimal",
    component: DecimalQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "date-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"date"> => node.type === "date",
    component: DateQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "dateTime-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"dateTime"> =>
      node.type === "dateTime",
    component: DateTimeQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "time-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"time"> => node.type === "time",
    component: TimeQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "url-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"url"> => node.type === "url",
    component: UrlQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "boolean-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"boolean"> =>
      node.type === "boolean",
    component: BooleanQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "quantity-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"quantity"> =>
      node.type === "quantity",
    component: QuantityQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "coding-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"coding"> => node.type === "coding",
    component: CodingQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "reference-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"reference"> =>
      node.type === "reference",
    component: ReferenceQuestionControl,
  },
  {
    name: "attachment-primitive",
    priority: 10,
    matcher: (node): node is IQuestionNode<"attachment"> =>
      node.type === "attachment",
    component: AttachmentQuestionControl,
  } as QuestionControlDefinition,
  {
    name: "unsupported-question",
    priority: Number.NEGATIVE_INFINITY,
    matcher: (_node): _node is IQuestionNode => true,
    component: UnsupportedQuestionControl,
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

function questionHasChildren(node: IQuestionNode) {
  return Array.isArray(node.template.item) && node.template.item.length > 0;
}

function isStringLike(
  node: IQuestionNode,
): node is IQuestionNode<StringLikeType> {
  return node.type === "string" || node.type === "text";
}

function isNumeric(node: IQuestionNode): node is IQuestionNode<NumericType> {
  return node.type === "integer" || node.type === "decimal";
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
