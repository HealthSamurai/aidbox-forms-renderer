import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  QuestionItemControl,
} from "@aidbox-forms/renderer/types.ts";
import type { QuestionnaireItem } from "fhir/r5";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeAnswerOptions,
  makeInitialValues,
  Renderer,
} from "../helpers.tsx";

type AnswerConstraint = QuestionnaireItem["answerConstraint"];

type DropdownArgs = {
  answerType: AnswerType;
  repeats: boolean;
  hasNestedItems: boolean;
  answerConstraint: AnswerConstraint;
  optionCount: number;
  initialSelection: "none" | "firstOption" | "customValue";
  readOnly: boolean;
};

type ListSelectArgs = {
  answerType: AnswerType;
  repeats: boolean;
  hasNestedItems: boolean;
  answerConstraint: AnswerConstraint;
  optionCount: number;
  initialSelection: "none" | "firstOption" | "customValue";
  readOnly: boolean;
  itemControl: "radio-button" | "check-box";
  includeOptions: boolean;
};

const selectionAnswerTypes: AnswerType[] = [
  "boolean",
  "integer",
  "decimal",
  "string",
  "text",
  "date",
  "dateTime",
  "time",
  "url",
  "quantity",
  "coding",
  "reference",
  "attachment",
];

const optionCountOptions = [3, 5, 8, 12];

const baseArgTypes = {
  answerType: {
    name: "Answer type",
    options: selectionAnswerTypes,
    control: { type: "select" },
  },
  repeats: {
    name: "Repeats",
    control: { type: "boolean" },
  },
  hasNestedItems: {
    name: "Has nested items",
    control: { type: "boolean" },
  },
  answerConstraint: {
    name: "Answer constraint",
    options: ["optionsOnly", "optionsOrType", "optionsOrString"],
    control: { type: "select" },
  },
  optionCount: {
    name: "Option count",
    options: optionCountOptions,
    control: { type: "select" },
  },
  initialSelection: {
    name: "Initial selection",
    options: ["none", "firstOption", "customValue"],
    control: { type: "select" },
  },
  readOnly: {
    name: "Read-only",
    control: { type: "boolean" },
  },
} as const;

function getSelectionSamples<T extends AnswerType>(
  type: T,
): Array<DataTypeToType<AnswerTypeToDataType<T>>> {
  switch (type) {
    case "boolean":
      return [true, false] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "integer":
      return [0, 1, 2, 3, 5, 8] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    case "decimal":
      return [0.5, 1.25, 2.75, 3.5, 4.25, 5.75] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    case "string":
      return ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    case "text":
      return [
        "Short note",
        "Longer text",
        "Multiple words",
        "Another option",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "date":
      return ["2024-01-01", "2024-02-14", "2024-06-01", "2024-12-31"] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    case "dateTime":
      return [
        "2024-01-01T09:00:00Z",
        "2024-03-15T13:15:00Z",
        "2024-07-04T18:45:00Z",
        "2024-12-31T23:59:00Z",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "time":
      return ["08:00:00", "12:30:00", "18:45:00", "23:15:00"] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    case "url":
      return [
        "https://example.org/alpha",
        "https://example.org/bravo",
        "https://example.org/charlie",
        "https://example.org/delta",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "quantity":
      return [
        {
          value: 1,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 5,
          unit: "kg",
          system: "http://unitsofmeasure.org",
          code: "kg",
        },
        {
          value: 10,
          unit: "mL",
          system: "http://unitsofmeasure.org",
          code: "mL",
        },
        {
          value: 25,
          unit: "mmol",
          system: "http://unitsofmeasure.org",
          code: "mmol",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "coding":
      return [
        {
          system: "http://loinc.org",
          code: "1234-5",
          display: "Option A",
        },
        {
          system: "http://loinc.org",
          code: "6789-0",
          display: "Option B",
        },
        {
          system: "http://snomed.info/sct",
          code: "11110000",
          display: "Option C",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "reference":
      return [
        { reference: "Patient/example", display: "Jane Doe" },
        { reference: "Patient/alpha", display: "John Doe" },
        { reference: "Patient/bravo", display: "Chris Doe" },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    case "attachment":
      return [
        {
          contentType: "text/plain",
          url: "https://example.org/doc-a.txt",
          title: "Document A",
        },
        {
          contentType: "image/png",
          url: "https://example.org/image-b.png",
          title: "Image B",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    default:
      return [] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
  }
}

function getCustomSelectionValue<T extends AnswerType>(
  type: T,
): DataTypeToType<AnswerTypeToDataType<T>> {
  switch (type) {
    case "boolean":
      return true as DataTypeToType<AnswerTypeToDataType<T>>;
    case "integer":
      return 42 as DataTypeToType<AnswerTypeToDataType<T>>;
    case "decimal":
      return 9.99 as DataTypeToType<AnswerTypeToDataType<T>>;
    case "string":
      return "Custom entry" as DataTypeToType<AnswerTypeToDataType<T>>;
    case "text":
      return "Custom text" as DataTypeToType<AnswerTypeToDataType<T>>;
    case "date":
      return "2025-01-15" as DataTypeToType<AnswerTypeToDataType<T>>;
    case "dateTime":
      return "2025-01-15T10:00:00Z" as DataTypeToType<AnswerTypeToDataType<T>>;
    case "time":
      return "10:15:00" as DataTypeToType<AnswerTypeToDataType<T>>;
    case "url":
      return "https://custom.example.org" as DataTypeToType<
        AnswerTypeToDataType<T>
      >;
    case "quantity":
      return {
        value: 33,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    case "coding":
      return {
        system: "http://loinc.org",
        code: "9999-9",
        display: "Custom code",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    case "reference":
      return {
        reference: "Patient/custom",
        display: "Custom patient",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    case "attachment":
      return {
        contentType: "text/plain",
        url: "https://example.org/custom.txt",
        title: "Custom attachment",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    default:
      return "" as DataTypeToType<AnswerTypeToDataType<T>>;
  }
}

function buildInitialValues<T extends AnswerType>(options: {
  type: T;
  repeats: boolean;
  selection: "none" | "firstOption" | "customValue";
  optionValues: Array<DataTypeToType<AnswerTypeToDataType<T>>>;
}): QuestionnaireItem["initial"] {
  if (options.selection === "none") {
    return [];
  }

  if (options.selection === "customValue") {
    const customValue = getCustomSelectionValue(options.type);
    const initialValues = options.repeats
      ? [customValue, ...(options.optionValues.slice(0, 1) ?? [])]
      : [customValue];
    return makeInitialValues(options.type, initialValues);
  }

  const initialValues = options.repeats
    ? options.optionValues.slice(0, 2)
    : options.optionValues.slice(0, 1);
  return makeInitialValues(options.type, initialValues);
}

function buildSelectionItem(
  args: DropdownArgs,
  control: QuestionItemControl,
): QuestionnaireItem {
  const optionValues = getSelectionSamples(args.answerType).slice(
    0,
    args.optionCount,
  );
  const initialValues = buildInitialValues({
    type: args.answerType,
    repeats: args.repeats,
    selection: args.initialSelection,
    optionValues,
  });

  const childItems = args.hasNestedItems
    ? [
        buildQuestionItem({
          linkId: "nested-question",
          text: "Nested question",
          type: "string",
          control: "text-box",
          readOnly: args.readOnly,
        }),
      ]
    : undefined;

  return buildQuestionItem({
    linkId: `${args.answerType}-selection`,
    text: `Dropdown (${args.answerType})`,
    type: args.answerType,
    control,
    repeats: args.repeats,
    readOnly: args.readOnly,
    answerConstraint: args.answerConstraint,
    answerOption: makeAnswerOptions(args.answerType, optionValues),
    initial: initialValues,
    item: childItems,
  });
}

function buildListSelectItem(args: ListSelectArgs): QuestionnaireItem {
  const optionValues = getSelectionSamples(args.answerType).slice(
    0,
    args.optionCount,
  );
  const includeOptions =
    args.answerType === "boolean" ? args.includeOptions !== false : true;
  const initialValues = buildInitialValues({
    type: args.answerType,
    repeats: args.repeats,
    selection: args.initialSelection,
    optionValues,
  });
  const childItems = args.hasNestedItems
    ? [
        buildQuestionItem({
          linkId: "nested-question",
          text: "Nested question",
          type: "string",
          control: "text-box",
          readOnly: args.readOnly,
        }),
      ]
    : undefined;

  return buildQuestionItem({
    linkId: `${args.answerType}-list-select`,
    text: `List select (${args.answerType})`,
    type: args.answerType,
    control: args.itemControl,
    repeats: args.repeats,
    readOnly: args.readOnly,
    answerConstraint: args.answerConstraint,
    answerOption: includeOptions
      ? makeAnswerOptions(args.answerType, optionValues)
      : undefined,
    initial: initialValues,
    item: childItems,
  });
}

const meta: Meta<DropdownArgs & Partial<ListSelectArgs>> = {
  title: "Renderers/Selection",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Selection renderer playgrounds for dropdown and list-select behaviors.",
      },
    },
  },
  argTypes: baseArgTypes,
  args: {
    answerType: "string",
    repeats: false,
    hasNestedItems: false,
    answerConstraint: "optionsOnly",
    optionCount: 5,
    initialSelection: "none",
    readOnly: false,
  },
};

export default meta;

export const DropdownRenderer: StoryObj<DropdownArgs> = {
  name: "Dropdown renderer",
  render: (args, context) => {
    const item = buildSelectionItem(args, "drop-down");
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};

export const ListSelectRenderer: StoryObj<ListSelectArgs> = {
  name: "List-select renderer",
  args: {
    itemControl: "radio-button",
    includeOptions: true,
  },
  argTypes: {
    ...baseArgTypes,
    itemControl: {
      name: "Item control",
      options: ["radio-button", "check-box"],
      control: { type: "select" },
    },
    includeOptions: {
      name: "Include answer options",
      control: { type: "boolean" },
      if: { arg: "answerType", eq: "boolean" },
    },
  },
  render: (args, context) => {
    const item = buildListSelectItem(args);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};
