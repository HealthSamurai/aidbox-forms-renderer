import type {
  GroupRendererDefinition,
  IQuestionNode,
  QuestionRendererDefinition,
} from "./types.ts";
import { AttachmentRenderer } from "./component/question/fhir/attachment/attachment-renderer.tsx";
import { BooleanRenderer } from "./component/question/fhir/boolean/boolean-renderer.tsx";
import { CodingRenderer } from "./component/question/fhir/coding/coding-renderer.tsx";
import { DateRenderer } from "./component/question/fhir/date/date-renderer.tsx";
import { DateTimeRenderer } from "./component/question/fhir/dateTime/date-time-renderer.tsx";
import { DecimalRenderer } from "./component/question/fhir/decimal/decimal-renderer.tsx";
import { IntegerRenderer } from "./component/question/fhir/integer/integer-renderer.tsx";
import { QuantityRenderer } from "./component/question/fhir/quantity/quantity-renderer.tsx";
import { ReferenceRenderer } from "./component/question/fhir/reference/reference-renderer.tsx";
import { StringRenderer } from "./component/question/fhir/string/string-renderer.tsx";
import { TimeRenderer } from "./component/question/fhir/time/time-renderer.tsx";
import { DropdownSelectRenderer } from "./component/question/renderer/dropdown-select-renderer.tsx";
import { ListSelectRenderer } from "./component/question/renderer/list-select-renderer.tsx";
import { NumberSliderRenderer } from "./component/question/renderer/number-slider-renderer.tsx";
import { NumberSpinnerRenderer } from "./component/question/renderer/number-spinner-renderer.tsx";
import { QuantitySliderRenderer } from "./component/question/renderer/quantity-slider-renderer.tsx";
import { QuantitySpinnerRenderer } from "./component/question/renderer/quantity-spinner-renderer.tsx";
import { UnsupportedRenderer } from "./component/question/renderer/unsupported-renderer.tsx";
import { DefaultRenderer } from "./component/group/renderer/default-renderer.tsx";
import { FooterRenderer } from "./component/group/renderer/footer-renderer.tsx";
import { GridRenderer } from "./component/group/renderer/grid-renderer.tsx";
import { GridTableRenderer } from "./component/group/renderer/grid-table-renderer.tsx";
import { HeaderRenderer } from "./component/group/renderer/header-renderer.tsx";
import { PageRenderer } from "./component/group/renderer/page-renderer.tsx";
import { SelectionTableRenderer } from "./component/group/renderer/selection-table-renderer.tsx";
import { TabContainerRenderer } from "./component/group/renderer/tab-container-renderer.tsx";
import { isGroupListStore } from "./store/group/group-list-store.ts";

export const questions: QuestionRendererDefinition[] = [
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
      (hasOptions(node) || node.type === "boolean") &&
      (node.control === "radio-button" || node.control === "check-box"),
    renderer: ListSelectRenderer,
  },
  {
    name: "dropdown",
    priority: 90,
    matcher: (node) =>
      hasOptions(node) ||
      (node.type === "boolean" &&
        (node.control === "drop-down" ||
          node.control === "autocomplete" ||
          node.control === "lookup")),
    renderer: DropdownSelectRenderer,
  },
  {
    name: "boolean",
    priority: 10,
    matcher: (node) => node.type === "boolean",
    renderer: BooleanRenderer,
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

export const groups: GroupRendererDefinition[] = [
  {
    name: "group-tab-container",
    priority: 100,
    matcher: (node) => node.control === "tab-container",
    renderer: TabContainerRenderer,
  },
  {
    name: "group-page",
    priority: 10,
    matcher: (node) => node.control === "page",
    renderer: PageRenderer,
  },
  {
    name: "group-header",
    priority: 10,
    matcher: (node) => node.control === "header",
    renderer: HeaderRenderer,
  },
  {
    name: "group-footer",
    priority: 10,
    matcher: (node) => node.control === "footer",
    renderer: FooterRenderer,
  },
  {
    name: "group-grid",
    priority: 10,
    matcher: (node) => node.control === "grid",
    renderer: GridRenderer,
  },
  {
    name: "group-gtable",
    priority: 10,
    matcher: (node) => isGroupListStore(node) && node.control === "gtable",
    renderer: GridTableRenderer,
  },
  {
    name: "group-htable",
    priority: 10,
    matcher: (node) => node.control === "htable",
    renderer: SelectionTableRenderer,
  },
  {
    name: "group-table",
    priority: 10,
    matcher: (node) => node.control === "table",
    renderer: SelectionTableRenderer,
  },
  {
    name: "group-list",
    priority: 10,
    matcher: (node) => node.control === "list",
    renderer: DefaultRenderer,
  },
  {
    name: "group-default",
    priority: Number.NEGATIVE_INFINITY,
    matcher: () => true,
    renderer: DefaultRenderer,
  },
];

function hasOptions(node: IQuestionNode) {
  return !!(
    node.template.answerOption?.length ||
    node.expressionRegistry.answer ||
    node.template.answerValueSet
  );
}
