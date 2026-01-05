import type { IQuestionNode, QuestionControlDefinition } from "../../types.ts";
import { StringRenderer } from "../../components/nodes/question/fhir/string/string-renderer.tsx";
import { IntegerRenderer } from "../../components/nodes/question/fhir/integer/integer-renderer.tsx";
import { DecimalRenderer } from "../../components/nodes/question/fhir/decimal/decimal-renderer.tsx";
import { DateRenderer } from "../../components/nodes/question/fhir/date/date-renderer.tsx";
import { DateTimeRenderer } from "../../components/nodes/question/fhir/dateTime/date-time-renderer.tsx";
import { TimeRenderer } from "../../components/nodes/question/fhir/time/time-renderer.tsx";
import { QuantityRenderer } from "../../components/nodes/question/fhir/quantity/quantity-renderer.tsx";
import { CodingRenderer } from "../../components/nodes/question/fhir/coding/coding-renderer.tsx";
import { ReferenceRenderer } from "../../components/nodes/question/fhir/reference/reference-renderer.tsx";
import { AttachmentRenderer } from "../../components/nodes/question/fhir/attachment/attachment-renderer.tsx";
import { ListSelectRenderer } from "../../components/nodes/question/renderers/list-select-renderer.tsx";
import { DropdownSelectRenderer } from "../../components/nodes/question/renderers/dropdown-select-renderer.tsx";
import { UnsupportedRenderer } from "../../components/nodes/question/renderers/unsupported-renderer.tsx";
import { NumberSliderRenderer } from "../../components/nodes/question/renderers/number-slider-renderer.tsx";
import { NumberSpinnerRenderer } from "../../components/nodes/question/renderers/number-spinner-renderer.tsx";
import { QuantitySliderRenderer } from "../../components/nodes/question/renderers/quantity-slider-renderer.tsx";
import { QuantitySpinnerRenderer } from "../../components/nodes/question/renderers/quantity-spinner-renderer.tsx";

export const defaultQuestionControlDefinitions: QuestionControlDefinition[] = [
  {
    name: "quantity-with-slider",
    priority: 121,
    matcher: (node): node is IQuestionNode<"quantity"> =>
      node.control === "slider" && node.type === "quantity",
    renderer: QuantitySliderRenderer,
  },
  {
    name: "quantity-with-spinner",
    priority: 116,
    matcher: (node) => node.control === "spinner" && node.type === "quantity",
    renderer: QuantitySpinnerRenderer,
  },
  {
    name: "number-with-slider",
    priority: 120,
    matcher: (node): node is IQuestionNode<"integer" | "decimal"> =>
      node.control === "slider" &&
      (node.type === "integer" || node.type === "decimal"),
    renderer: NumberSliderRenderer,
  },
  {
    name: "number-with-spinner",
    priority: 115,
    matcher: (node) =>
      node.control === "spinner" &&
      (node.type === "integer" || node.type === "decimal"),
    renderer: NumberSpinnerRenderer,
  },
  {
    name: "list-select",
    priority: 95,
    matcher: (node) =>
      hasOptions(node) &&
      (node.control === "radio-button" || node.control === "check-box"),
    renderer: ListSelectRenderer,
  },
  {
    name: "dropdown",
    priority: 90,
    matcher: (node) => hasOptions(node),
    renderer: DropdownSelectRenderer,
  },
  {
    name: "boolean-with-list",
    priority: 20,
    matcher: (node) => node.type === "boolean",
    renderer: ListSelectRenderer,
  },
  {
    name: "string",
    priority: 10,
    matcher: (node) => node.type === "string",
    renderer: StringRenderer,
  },
  {
    name: "text",
    priority: 10,
    matcher: (node) => node.type === "text",
    renderer: StringRenderer,
  },
  {
    name: "url",
    priority: 10,
    matcher: (node) => node.type === "url",
    renderer: StringRenderer,
  },
  {
    name: "integer",
    priority: 10,
    matcher: (node) => node.type === "integer",
    renderer: IntegerRenderer,
  },
  {
    name: "decimal",
    priority: 10,
    matcher: (node) => node.type === "decimal",
    renderer: DecimalRenderer,
  },
  {
    name: "date",
    priority: 10,
    matcher: (node) => node.type === "date",
    renderer: DateRenderer,
  },
  {
    name: "date-time",
    priority: 10,
    matcher: (node) => node.type === "dateTime",
    renderer: DateTimeRenderer,
  },
  {
    name: "time",
    priority: 10,
    matcher: (node) => node.type === "time",
    renderer: TimeRenderer,
  },
  {
    name: "quantity",
    priority: 10,
    matcher: (node) => node.type === "quantity",
    renderer: QuantityRenderer,
  },
  {
    name: "coding",
    priority: 10,
    matcher: (node) => node.type === "coding",
    renderer: CodingRenderer,
  },
  {
    name: "reference",
    priority: 10,
    matcher: (node) => node.type === "reference",
    renderer: ReferenceRenderer,
  },
  {
    name: "attachment",
    priority: 10,
    matcher: (node) => node.type === "attachment",
    renderer: AttachmentRenderer,
  },
  {
    name: "unsupported-question",
    priority: Number.NEGATIVE_INFINITY,
    matcher: () => true,
    renderer: UnsupportedRenderer,
  },
];

function hasOptions(node: IQuestionNode) {
  return !!(
    node.template.answerOption?.length ||
    node.expressionRegistry.answer ||
    node.template.answerValueSet
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
