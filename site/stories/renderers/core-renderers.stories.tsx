import type { Meta, StoryObj } from "@storybook/react-vite";
import type { QuestionnaireItem } from "fhir/r5";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeInitialValues,
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";

type CoreRendererConfig = {
  name: string;
  buildItem: () => QuestionnaireItem;
};

const UNIT_SYSTEM = "http://unitsofmeasure.org";

const coreRenderers = {
  string: {
    name: "String",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-string",
        text: "String",
        type: "string",
        initial: makeInitialValues("string", ["Sample text"]),
      }),
  },
  integer: {
    name: "Integer",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-integer",
        text: "Integer",
        type: "integer",
        initial: makeInitialValues("integer", [42]),
      }),
  },
  decimal: {
    name: "Decimal",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-decimal",
        text: "Decimal",
        type: "decimal",
        initial: makeInitialValues("decimal", [3.14]),
      }),
  },
  boolean: {
    name: "Boolean",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-boolean",
        text: "Boolean",
        type: "boolean",
        initial: makeInitialValues("boolean", [true]),
      }),
  },
  date: {
    name: "Date",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-date",
        text: "Date",
        type: "date",
        initial: makeInitialValues("date", ["2024-09-20"]),
      }),
  },
  dateTime: {
    name: "Date-time",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-date-time",
        text: "DateTime",
        type: "dateTime",
        initial: makeInitialValues("dateTime", ["2024-09-20T09:30:00Z"]),
      }),
  },
  time: {
    name: "Time",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-time",
        text: "Time",
        type: "time",
        initial: makeInitialValues("time", ["14:45:00"]),
      }),
  },
  quantity: {
    name: "Quantity",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-quantity",
        text: "Quantity",
        type: "quantity",
        initial: makeInitialValues("quantity", [
          {
            value: 5,
            unit: "mg",
            system: UNIT_SYSTEM,
            code: "mg",
          },
        ]),
      }),
  },
  coding: {
    name: "Coding",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-coding",
        text: "Coding",
        type: "coding",
        initial: makeInitialValues("coding", [
          {
            system: "http://loinc.org",
            code: "1234-5",
            display: "Example code",
          },
        ]),
      }),
  },
  reference: {
    name: "Reference",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-reference",
        text: "Reference",
        type: "reference",
        initial: makeInitialValues("reference", [
          {
            reference: "Patient/example",
            display: "Jane Doe",
          },
        ]),
      }),
  },
  attachment: {
    name: "Attachment",
    buildItem: () =>
      buildQuestionItem({
        linkId: "core-attachment",
        text: "Attachment",
        type: "attachment",
        initial: makeInitialValues("attachment", [
          {
            title: "Sample.pdf",
            url: "https://example.org/sample.pdf",
            contentType: "application/pdf",
            size: "45211",
          },
        ]),
      }),
  },
} satisfies Record<string, CoreRendererConfig>;

const meta: Meta = {
  title: "Renderers/Core",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Core FHIR question renderers without selection, slider, or spinner controls.",
      },
    },
  },
};

export default meta;

function makeStory(config: CoreRendererConfig): StoryObj {
  return {
    name: config.name,
    render: (_, context) => {
      const item = config.buildItem();
      return (
        <Renderer
          questionnaire={buildQuestionnaire(item)}
          storyId={context.id}
        />
      );
    },
  };
}

export const StringRenderer = makeStory(coreRenderers.string);
export const IntegerRenderer = makeStory(coreRenderers.integer);
export const DecimalRenderer = makeStory(coreRenderers.decimal);
export const BooleanRenderer = makeStory(coreRenderers.boolean);
export const DateRenderer = makeStory(coreRenderers.date);
export const DateTimeRenderer = makeStory(coreRenderers.dateTime);
export const TimeRenderer = makeStory(coreRenderers.time);
export const QuantityRenderer = makeStory(coreRenderers.quantity);
export const CodingRenderer = makeStory(coreRenderers.coding);
export const ReferenceRenderer = makeStory(coreRenderers.reference);
export const AttachmentRenderer = makeStory(coreRenderers.attachment);
