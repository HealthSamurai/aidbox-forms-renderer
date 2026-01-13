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
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";

type AnswerConstraint = QuestionnaireItem["answerConstraint"];

type DropdownArguments = {
  answerType: AnswerType;
  repeats: boolean;
  hasNestedItems: boolean;
  answerConstraint: AnswerConstraint;
  optionCount: number;
  initialSelection: "none" | "firstOption" | "customValue";
  readOnly: boolean;
};

type ListSelectArguments = {
  answerType: AnswerType;
  repeats: boolean;
  hasNestedItems: boolean;
  answerConstraint: AnswerConstraint;
  optionCount: number;
  initialSelection: "none" | "firstOption" | "customValue";
  readOnly: boolean;
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

const baseArgumentTypes = {
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
    if: { arg: "answerConstraint", neq: "optionsOnly" },
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
    case "boolean": {
      return [true, false] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "integer": {
      return [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as Array<
        DataTypeToType<AnswerTypeToDataType<T>>
      >;
    }
    case "decimal": {
      return [
        0.5, 1.25, 2.75, 3.5, 4.25, 5.75, 6.5, 7.25, 8.5, 9.75, 10.25, 11.5,
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "string": {
      return [
        "Alpha",
        "Bravo",
        "Charlie",
        "Delta",
        "Echo",
        "Foxtrot",
        "Golf",
        "Hotel",
        "India",
        "Juliet",
        "Kilo",
        "Lima",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "text": {
      return [
        "Short note",
        "Longer text",
        "Multiple words",
        "Another option",
        "Additional detail",
        "Summary statement",
        "Narrative entry",
        "Follow-up note",
        "Context snippet",
        "Supplemental info",
        "Clarifying remark",
        "Closing comment",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "date": {
      return [
        "2024-01-01",
        "2024-02-14",
        "2024-06-01",
        "2024-12-31",
        "2025-01-05",
        "2025-02-10",
        "2025-03-20",
        "2025-04-15",
        "2025-05-25",
        "2025-06-30",
        "2025-07-12",
        "2025-08-08",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "dateTime": {
      return [
        "2024-01-01T09:00:00Z",
        "2024-03-15T13:15:00Z",
        "2024-07-04T18:45:00Z",
        "2024-12-31T23:59:00Z",
        "2025-01-01T08:30:00Z",
        "2025-02-14T11:00:00Z",
        "2025-03-21T14:20:00Z",
        "2025-04-05T16:40:00Z",
        "2025-05-12T10:10:00Z",
        "2025-06-18T19:05:00Z",
        "2025-07-22T07:50:00Z",
        "2025-08-30T21:30:00Z",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "time": {
      return [
        "08:00:00",
        "09:15:00",
        "10:30:00",
        "11:45:00",
        "12:30:00",
        "14:00:00",
        "15:15:00",
        "16:30:00",
        "18:00:00",
        "19:15:00",
        "21:00:00",
        "23:15:00",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "url": {
      return [
        "https://example.org/alpha",
        "https://example.org/bravo",
        "https://example.org/charlie",
        "https://example.org/delta",
        "https://example.org/echo",
        "https://example.org/foxtrot",
        "https://example.org/golf",
        "https://example.org/hotel",
        "https://example.org/india",
        "https://example.org/juliet",
        "https://example.org/kilo",
        "https://example.org/lima",
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "quantity": {
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
        {
          value: 30,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 35,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 40,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 45,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 50,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 55,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 60,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        {
          value: 65,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "coding": {
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
        {
          system: "http://loinc.org",
          code: "2222-2",
          display: "Option D",
        },
        {
          system: "http://loinc.org",
          code: "3333-3",
          display: "Option E",
        },
        {
          system: "http://loinc.org",
          code: "4444-4",
          display: "Option F",
        },
        {
          system: "http://loinc.org",
          code: "5555-5",
          display: "Option G",
        },
        {
          system: "http://loinc.org",
          code: "6666-6",
          display: "Option H",
        },
        {
          system: "http://loinc.org",
          code: "7777-7",
          display: "Option I",
        },
        {
          system: "http://loinc.org",
          code: "8888-8",
          display: "Option J",
        },
        {
          system: "http://loinc.org",
          code: "9999-9",
          display: "Option K",
        },
        {
          system: "http://loinc.org",
          code: "1010-1",
          display: "Option L",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "reference": {
      return [
        { reference: "Patient/example", display: "Jane Doe" },
        { reference: "Patient/alpha", display: "John Doe" },
        { reference: "Patient/bravo", display: "Chris Doe" },
        { reference: "Patient/charlie", display: "Taylor Doe" },
        { reference: "Patient/delta", display: "Morgan Doe" },
        { reference: "Patient/echo", display: "Alex Doe" },
        { reference: "Patient/foxtrot", display: "Jordan Doe" },
        { reference: "Patient/golf", display: "Riley Doe" },
        { reference: "Patient/hotel", display: "Casey Doe" },
        { reference: "Patient/india", display: "Drew Doe" },
        { reference: "Patient/juliet", display: "Skyler Doe" },
        { reference: "Patient/kilo", display: "Avery Doe" },
        { reference: "Patient/lima", display: "Quinn Doe" },
        { reference: "Patient/mike", display: "Parker Doe" },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    case "attachment": {
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
        {
          contentType: "application/pdf",
          url: "https://example.org/doc-c.pdf",
          title: "Document C",
        },
        {
          contentType: "image/jpeg",
          url: "https://example.org/image-d.jpg",
          title: "Image D",
        },
        {
          contentType: "text/plain",
          url: "https://example.org/doc-e.txt",
          title: "Document E",
        },
        {
          contentType: "application/pdf",
          url: "https://example.org/doc-f.pdf",
          title: "Document F",
        },
        {
          contentType: "image/png",
          url: "https://example.org/image-g.png",
          title: "Image G",
        },
        {
          contentType: "text/plain",
          url: "https://example.org/doc-h.txt",
          title: "Document H",
        },
        {
          contentType: "application/pdf",
          url: "https://example.org/doc-i.pdf",
          title: "Document I",
        },
        {
          contentType: "image/jpeg",
          url: "https://example.org/image-j.jpg",
          title: "Image J",
        },
        {
          contentType: "text/plain",
          url: "https://example.org/doc-k.txt",
          title: "Document K",
        },
        {
          contentType: "application/pdf",
          url: "https://example.org/doc-l.pdf",
          title: "Document L",
        },
      ] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
    default: {
      return [] as Array<DataTypeToType<AnswerTypeToDataType<T>>>;
    }
  }
}

function getCustomSelectionValue<T extends AnswerType>(
  type: T,
): DataTypeToType<AnswerTypeToDataType<T>> {
  switch (type) {
    case "boolean": {
      return true as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "integer": {
      return 42 as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "decimal": {
      return 9.99 as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "string": {
      return "Custom entry" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "text": {
      return "Custom text" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "date": {
      return "2025-01-15" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "dateTime": {
      return "2025-01-15T10:00:00Z" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "time": {
      return "10:15:00" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "url": {
      return "https://custom.example.org" as DataTypeToType<
        AnswerTypeToDataType<T>
      >;
    }
    case "quantity": {
      return {
        value: 33,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "coding": {
      return {
        system: "http://loinc.org",
        code: "9999-9",
        display: "Custom code",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "reference": {
      return {
        reference: "Patient/custom",
        display: "Custom patient",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    case "attachment": {
      return {
        contentType: "text/plain",
        url: "https://example.org/custom.txt",
        title: "Custom attachment",
      } as DataTypeToType<AnswerTypeToDataType<T>>;
    }
    default: {
      return "" as DataTypeToType<AnswerTypeToDataType<T>>;
    }
  }
}

function getCustomStringSelectionValue(type: AnswerType): string {
  const value = getCustomSelectionValue(type);
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "Custom entry";
}

function buildInitialValues<T extends AnswerType>(options: {
  type: T;
  repeats: boolean;
  selection: "none" | "firstOption" | "customValue";
  answerConstraint: AnswerConstraint;
  optionValues: Array<DataTypeToType<AnswerTypeToDataType<T>>>;
}): QuestionnaireItem["initial"] {
  if (options.selection === "none") {
    return [];
  }

  if (options.selection === "customValue") {
    if (options.answerConstraint === "optionsOrString") {
      const customValue = getCustomStringSelectionValue(options.type);
      const customInitials = makeInitialValues("string", [customValue]);
      if (options.repeats) {
        const optionInitials = makeInitialValues(
          options.type,
          options.optionValues.slice(0, 1),
        );
        return [...customInitials, ...optionInitials];
      }
      return customInitials;
    }
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
  arguments_: DropdownArguments,
  control: QuestionItemControl,
): QuestionnaireItem {
  const optionValues = getSelectionSamples(arguments_.answerType).slice(
    0,
    arguments_.optionCount,
  );
  const initialValues = buildInitialValues({
    type: arguments_.answerType,
    repeats: arguments_.repeats,
    selection: arguments_.initialSelection,
    answerConstraint: arguments_.answerConstraint,
    optionValues,
  });

  const childItems = arguments_.hasNestedItems
    ? [
        buildQuestionItem({
          linkId: "nested-question",
          text: "Nested question",
          type: "string",
          control: "text-box",
          readOnly: arguments_.readOnly,
        }),
      ]
    : undefined;

  return buildQuestionItem({
    linkId: `${arguments_.answerType}-selection`,
    text: `Dropdown (${arguments_.answerType})`,
    type: arguments_.answerType,
    control,
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    answerConstraint: arguments_.answerConstraint,
    answerOption: makeAnswerOptions(arguments_.answerType, optionValues),
    initial: initialValues,
    item: childItems,
  });
}

function buildListSelectItem(
  arguments_: ListSelectArguments,
): QuestionnaireItem {
  const optionValues = getSelectionSamples(arguments_.answerType).slice(
    0,
    arguments_.optionCount,
  );
  const includeOptions =
    arguments_.answerType === "boolean" ? arguments_.includeOptions : true;
  const initialValues = buildInitialValues({
    type: arguments_.answerType,
    repeats: arguments_.repeats,
    selection: arguments_.initialSelection,
    answerConstraint: arguments_.answerConstraint,
    optionValues,
  });
  const childItems = arguments_.hasNestedItems
    ? [
        buildQuestionItem({
          linkId: "nested-question",
          text: "Nested question",
          type: "string",
          control: "text-box",
          readOnly: arguments_.readOnly,
        }),
      ]
    : undefined;

  return buildQuestionItem({
    linkId: `${arguments_.answerType}-list-select`,
    text: `List select (${arguments_.answerType})`,
    type: arguments_.answerType,
    control: arguments_.repeats ? "check-box" : "radio-button",
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    answerConstraint: arguments_.answerConstraint,
    answerOption: includeOptions
      ? makeAnswerOptions(arguments_.answerType, optionValues)
      : undefined,
    initial: initialValues,
    item: childItems,
  });
}

const meta: Meta<DropdownArguments & Partial<ListSelectArguments>> = {
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
  argTypes: baseArgumentTypes,
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

export const DropdownRenderer: StoryObj<DropdownArguments> = {
  name: "Dropdown Select",
  render: (arguments_, context) => {
    const item = buildSelectionItem(arguments_, "drop-down");
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};

export const ListSelectRenderer: StoryObj<ListSelectArguments> = {
  name: "List Select",
  args: {
    includeOptions: true,
  },
  argTypes: {
    ...baseArgumentTypes,
    includeOptions: {
      name: "Include answer options",
      control: { type: "boolean" },
      if: { arg: "answerType", eq: "boolean" },
    },
  },
  render: (arguments_, context) => {
    const item = buildListSelectItem(arguments_);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};
