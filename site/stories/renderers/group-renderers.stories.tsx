import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Extension, QuestionnaireItem } from "fhir/r5";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  GroupItemControl,
} from "@aidbox-forms/renderer/types.ts";
import { EXT, ITEM_CONTROL_SYSTEM } from "@aidbox-forms/renderer/utils.ts";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeAnswerOptions,
  makeInitialValues,
  Renderer,
} from "../helpers.tsx";

type GroupItemConfig = {
  linkId: string;
  text: string;
  control?: GroupItemControl | undefined;
  repeats?: boolean | undefined;
  readOnly?: boolean | undefined;
  extensions?: Extension[] | undefined;
  item?: QuestionnaireItem[] | undefined;
};

function buildGroupItem(options: GroupItemConfig): QuestionnaireItem {
  const extensions = [...(options.extensions ?? [])];

  if (options.control) {
    extensions.push({
      url: EXT.ITEM_CONTROL,
      valueCodeableConcept: {
        coding: [
          {
            system: ITEM_CONTROL_SYSTEM,
            code: options.control,
          },
        ],
      },
    });
  }

  return {
    linkId: options.linkId,
    text: options.text,
    type: "group",
    repeats: options.repeats,
    readOnly: options.readOnly,
    extension: extensions.length > 0 ? extensions : undefined,
    item: options.item && options.item.length > 0 ? options.item : undefined,
  };
}

const baseQuestions = [
  buildQuestionItem({
    linkId: "first-name",
    text: "First name",
    type: "string",
    control: "text-box",
  }),
  buildQuestionItem({
    linkId: "age",
    text: "Age",
    type: "integer",
    control: "spinner",
  }),
];

type TableOptionOverlap = "exact" | "overlap" | "sparse";
type TableAnswerType = AnswerType;
type TableSelectionMode = "single" | "multi" | "mixed";
type TableInitialSelection = "none" | "partial" | "full";
type TableMaxSelections = "none" | "1" | "2";

type TableOptionValue<T extends TableAnswerType> = DataTypeToType<
  AnswerTypeToDataType<T>
>;
type TableOptionSet<T> = Record<TableOptionOverlap, T[][]>;

const tableQuestionSpecs = [
  { linkId: "taste", text: "Taste" },
  { linkId: "color", text: "Color" },
  { linkId: "size", text: "Size" },
  { linkId: "shape", text: "Shape" },
  { linkId: "texture", text: "Texture" },
];

const stringOptionSets: TableOptionSet<string> = {
  exact: [
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
    ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
  ],
  overlap: [
    ["Red", "Blue", "Green", "Yellow", "Purple"],
    ["Blue", "Green", "Yellow", "Purple", "Orange"],
    ["Green", "Yellow", "Purple", "Orange", "Teal"],
    ["Yellow", "Purple", "Orange", "Teal", "Cyan"],
    ["Purple", "Orange", "Teal", "Cyan", "Magenta"],
  ],
  sparse: [
    ["Sweet", "Salty", "Sour", "Bitter", "Umami"],
    ["Circle", "Square", "Triangle", "Hexagon", "Star"],
    ["Small", "Medium", "Large", "XL", "XXL"],
    ["Hot", "Cold", "Warm", "Cool", "Icy"],
    ["North", "South", "East", "West", "Center"],
  ],
};

const integerOptionSets: TableOptionSet<number> = {
  exact: [
    [10, 20, 30, 40, 50],
    [10, 20, 30, 40, 50],
    [10, 20, 30, 40, 50],
    [10, 20, 30, 40, 50],
    [10, 20, 30, 40, 50],
  ],
  overlap: [
    [1, 2, 3, 4, 5],
    [3, 4, 5, 6, 7],
    [5, 6, 7, 8, 9],
    [7, 8, 9, 10, 11],
    [9, 10, 11, 12, 13],
  ],
  sparse: [
    [10, 11, 12, 13, 14],
    [20, 21, 22, 23, 24],
    [30, 31, 32, 33, 34],
    [40, 41, 42, 43, 44],
    [50, 51, 52, 53, 54],
  ],
};

const booleanOptionSets: TableOptionSet<boolean> = {
  exact: [
    [true, false],
    [true, false],
    [true, false],
    [true, false],
    [true, false],
  ],
  overlap: [
    [true, false],
    [true, false],
    [true, false],
    [true, false],
    [true, false],
  ],
  sparse: [
    [true, false],
    [true, false],
    [true, false],
    [true, false],
    [true, false],
  ],
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function mapOptionSets<T, U>(
  sets: TableOptionSet<T>,
  map: (value: T, rowIndex: number, valueIndex: number) => U,
): TableOptionSet<U> {
  return {
    exact: sets.exact.map((row, rowIndex) =>
      row.map((value, valueIndex) => map(value, rowIndex, valueIndex)),
    ),
    overlap: sets.overlap.map((row, rowIndex) =>
      row.map((value, valueIndex) => map(value, rowIndex, valueIndex)),
    ),
    sparse: sets.sparse.map((row, rowIndex) =>
      row.map((value, valueIndex) => map(value, rowIndex, valueIndex)),
    ),
  };
}

function buildSteppedOptionSets<T>(
  rowStartsByVariant: Record<TableOptionOverlap, number[]>,
  buildRow: (start: number, rowIndex: number) => T[],
): TableOptionSet<T> {
  return {
    exact: rowStartsByVariant.exact.map((start, rowIndex) =>
      buildRow(start, rowIndex),
    ),
    overlap: rowStartsByVariant.overlap.map((start, rowIndex) =>
      buildRow(start, rowIndex),
    ),
    sparse: rowStartsByVariant.sparse.map((start, rowIndex) =>
      buildRow(start, rowIndex),
    ),
  };
}

const dayRowStarts: Record<TableOptionOverlap, number[]> = {
  exact: [1, 1, 1, 1, 1],
  overlap: [1, 3, 5, 7, 9],
  sparse: [1, 7, 13, 19, 25],
};

const timeRowStarts: Record<TableOptionOverlap, number[]> = {
  exact: [8, 8, 8, 8, 8],
  overlap: [8, 10, 12, 14, 16],
  sparse: [6, 9, 12, 15, 18],
};

const decimalOptionSets = mapOptionSets(
  integerOptionSets,
  (value) => value + 0.5,
);
const urlOptionSets = mapOptionSets(
  stringOptionSets,
  (value) => `https://example.org/${toSlug(value)}`,
);
const dateOptionSets = buildSteppedOptionSets(dayRowStarts, (startDay) =>
  Array.from({ length: 5 }, (_, index) => {
    const day = pad2(startDay + index);
    return `2024-03-${day}`;
  }),
);
const dateTimeOptionSets = buildSteppedOptionSets(dayRowStarts, (startDay) =>
  Array.from({ length: 5 }, (_, index) => {
    const day = pad2(startDay + index);
    const hour = pad2(8 + index);
    return `2024-03-${day}T${hour}:00:00Z`;
  }),
);
const timeOptionSets = buildSteppedOptionSets(timeRowStarts, (startHour) =>
  Array.from({ length: 5 }, (_, index) => `${pad2(startHour + index)}:00:00`),
);

const codingSystems = [
  "http://example.org/taste",
  "http://example.org/color",
  "http://example.org/size",
  "http://example.org/shape",
  "http://example.org/texture",
];
const codingOptionSets = mapOptionSets(stringOptionSets, (value, rowIndex) => ({
  system: codingSystems[rowIndex % codingSystems.length],
  code: toSlug(value),
  display: value,
}));

const referenceTypes = [
  "Patient",
  "Practitioner",
  "Organization",
  "Location",
  "Device",
];
const referenceOptionSets = mapOptionSets(
  stringOptionSets,
  (value, rowIndex, valueIndex) => ({
    reference: `${referenceTypes[rowIndex % referenceTypes.length]}/${rowIndex + 1}${valueIndex + 1}`,
    display: value,
  }),
);

const attachmentOptionSets = mapOptionSets(stringOptionSets, (value) => ({
  contentType: "text/plain",
  url: `https://files.example/${toSlug(value)}.txt`,
  title: value,
}));

const quantityUnits = ["mg", "ml", "cm", "kg", "bpm"];
const quantityOptionSets = mapOptionSets(
  integerOptionSets,
  (value, rowIndex) => {
    const unit = quantityUnits[rowIndex % quantityUnits.length];
    return {
      value,
      unit,
      system: "http://unitsofmeasure.org",
      code: unit,
    };
  },
);

function buildOptionSets<T extends TableAnswerType>(
  type: T,
  variant: TableOptionOverlap,
): Array<Array<TableOptionValue<T>>> {
  if (type === "integer") {
    return integerOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "decimal") {
    return decimalOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "boolean") {
    return booleanOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "date") {
    return dateOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "dateTime") {
    return dateTimeOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "time") {
    return timeOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "url") {
    return urlOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "coding") {
    return codingOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "reference") {
    return referenceOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "attachment") {
    return attachmentOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  if (type === "quantity") {
    return quantityOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
  }
  return stringOptionSets[variant] as Array<Array<TableOptionValue<T>>>;
}

function buildInitialSelectionValues<T extends TableAnswerType>(options: {
  values: Array<TableOptionValue<T>>;
  repeats: boolean;
  maxSelections: number | undefined;
  initialSelection: TableInitialSelection;
  index: number;
}): Array<TableOptionValue<T>> {
  if (options.initialSelection === "none" || options.values.length === 0) {
    return [];
  }

  const shouldSelect =
    options.initialSelection === "full" ||
    (options.initialSelection === "partial" && options.index % 2 === 0);

  if (!shouldSelect) {
    return [];
  }

  if (!options.repeats) {
    return [options.values[0]];
  }

  const maxCount =
    options.initialSelection === "partial"
      ? 1
      : (options.maxSelections ?? options.values.length);
  return options.values.slice(0, Math.min(maxCount, options.values.length));
}

function buildTableQuestions(options: {
  answerType: TableAnswerType;
  questionCount: number;
  optionCount: number;
  optionOverlap: TableOptionOverlap;
  selectionMode: TableSelectionMode;
  maxSelections: number | undefined;
  initialSelection: TableInitialSelection;
}): QuestionnaireItem[] {
  const optionSets = buildOptionSets(options.answerType, options.optionOverlap);
  const questionSpecs = tableQuestionSpecs.slice(0, options.questionCount);

  return questionSpecs.map((spec, index) => {
    const repeats =
      options.selectionMode === "multi" ||
      (options.selectionMode === "mixed" && index % 2 === 0);
    const optionValues = (optionSets[index] ?? []).slice(
      0,
      options.optionCount,
    );
    const initialValues = buildInitialSelectionValues({
      values: optionValues,
      repeats,
      maxSelections: options.maxSelections,
      initialSelection: options.initialSelection,
      index,
    });
    const extensions: Extension[] = [];

    if (repeats && options.maxSelections !== undefined) {
      extensions.push({
        url: EXT.MAX_OCCURS,
        valueInteger: options.maxSelections,
      });
    }

    return buildQuestionItem({
      linkId: spec.linkId,
      text: spec.text,
      type: options.answerType,
      repeats,
      answerConstraint: "optionsOnly",
      answerOption: makeAnswerOptions(options.answerType, optionValues),
      extensions,
      initial: makeInitialValues(options.answerType, initialValues),
    });
  });
}

const meta: Meta = {
  title: "Renderers/Group",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Group renderer examples for each supported control.",
      },
    },
  },
};

export default meta;

function makeStory(item: QuestionnaireItem): StoryObj {
  return {
    render: (_args, context) => (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    ),
  };
}

type TableGroupArgs = {
  orientation: "vertical" | "horizontal";
  optionOverlap: TableOptionOverlap;
  answerType: TableAnswerType;
  questionCount: number;
  optionCount: number;
  selectionMode: TableSelectionMode;
  maxSelections: TableMaxSelections;
  initialSelection: TableInitialSelection;
  readOnly: boolean;
};

const tableGroupArgTypes = {
  orientation: {
    name: "Orientation",
    options: ["vertical", "horizontal"],
    control: { type: "select" },
  },
  optionOverlap: {
    name: "Option overlap",
    options: ["exact", "overlap", "sparse"],
    control: { type: "select" },
  },
  answerType: {
    name: "Answer type",
    options: [
      "string",
      "text",
      "integer",
      "decimal",
      "boolean",
      "date",
      "dateTime",
      "time",
      "url",
      "coding",
      "reference",
      "attachment",
      "quantity",
    ],
    control: { type: "select" },
  },
  questionCount: {
    name: "Question count",
    options: [0, 1, 3, 5],
    control: { type: "select" },
  },
  optionCount: {
    name: "Option count",
    options: [0, 1, 3, 5],
    control: { type: "select" },
  },
  selectionMode: {
    name: "Selection mode",
    options: ["single", "multi", "mixed"],
    control: { type: "select" },
  },
  maxSelections: {
    name: "Max selections",
    options: ["none", "1", "2"],
    control: { type: "select" },
  },
  initialSelection: {
    name: "Initial selection",
    options: ["none", "partial", "full"],
    control: { type: "select" },
  },
  readOnly: {
    name: "Read-only",
    control: { type: "boolean" },
  },
};

export const DefaultGroupRenderer = {
  name: "Default group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-default",
      text: "Default group",
      item: baseQuestions,
    }),
  ),
};

export const ListGroupRenderer = {
  name: "List group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-list",
      text: "List group",
      control: "list",
      item: baseQuestions,
    }),
  ),
};

export const TableGroupRenderer = {
  name: "Table group",
  args: {
    orientation: "vertical",
    optionOverlap: "overlap",
    answerType: "string",
    questionCount: 3,
    optionCount: 3,
    selectionMode: "single",
    maxSelections: "none",
    initialSelection: "none",
    readOnly: false,
  },
  argTypes: tableGroupArgTypes,
  render: (args: TableGroupArgs, context) => {
    const control = args.orientation === "horizontal" ? "htable" : "table";
    const maxSelections =
      args.maxSelections === "none" ? undefined : Number(args.maxSelections);
    const tableQuestions = buildTableQuestions({
      answerType: args.answerType,
      questionCount: args.questionCount,
      optionCount: args.optionCount,
      optionOverlap: args.optionOverlap,
      selectionMode: args.selectionMode,
      maxSelections,
      initialSelection: args.initialSelection,
    });
    const item = buildGroupItem({
      linkId: "group-table",
      text: "Selection table",
      control,
      readOnly: args.readOnly,
      item: tableQuestions,
    });
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
} satisfies StoryObj<TableGroupArgs>;

export const GridGroupRenderer = {
  name: "Grid group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-grid",
      text: "Daily check-in",
      control: "grid",
      item: [
        buildGroupItem({
          linkId: "row-intake",
          text: "Morning",
          item: [
            buildQuestionItem({
              linkId: "intake-fluid",
              text: "Fluid intake (mL)",
              type: "integer",
              control: "spinner",
            }),
            buildQuestionItem({
              linkId: "intake-notes",
              text: "Notes",
              type: "string",
              control: "text-box",
            }),
          ],
        }),
        buildGroupItem({
          linkId: "row-output",
          text: "Evening",
          item: [
            buildQuestionItem({
              linkId: "output-fluid",
              text: "Fluid output (mL)",
              type: "integer",
              control: "spinner",
            }),
            buildQuestionItem({
              linkId: "output-notes",
              text: "Notes",
              type: "string",
              control: "text-box",
            }),
          ],
        }),
      ],
    }),
  ),
};

export const GridTableGroupRenderer = {
  name: "Grid table group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-gtable",
      text: "Medications",
      control: "gtable",
      repeats: true,
      extensions: [{ url: EXT.MIN_OCCURS, valueInteger: 1 }],
      item: [
        buildQuestionItem({
          linkId: "med-name",
          text: "Medication",
          type: "string",
          control: "text-box",
        }),
        buildQuestionItem({
          linkId: "dose",
          text: "Dose",
          type: "integer",
          control: "spinner",
        }),
        buildQuestionItem({
          linkId: "frequency",
          text: "Frequency",
          type: "string",
          control: "text-box",
        }),
      ],
    }),
  ),
};

export const HeaderGroupRenderer = {
  name: "Header group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-header",
      text: "Header section",
      control: "header",
      item: baseQuestions,
    }),
  ),
};

export const FooterGroupRenderer = {
  name: "Footer group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-footer",
      text: "Footer section",
      control: "footer",
      item: baseQuestions,
    }),
  ),
};

export const PageGroupRenderer = {
  name: "Page group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-page",
      text: "Page section",
      control: "page",
      item: baseQuestions,
    }),
  ),
};

export const TabContainerGroupRenderer = {
  name: "Tab container group",
  ...makeStory(
    buildGroupItem({
      linkId: "group-tabs",
      text: "Profile",
      control: "tab-container",
      item: [
        buildGroupItem({
          linkId: "tab-basics",
          text: "Basics",
          item: [
            buildQuestionItem({
              linkId: "first-name-tab",
              text: "First name",
              type: "string",
              control: "text-box",
            }),
            buildQuestionItem({
              linkId: "last-name-tab",
              text: "Last name",
              type: "string",
              control: "text-box",
            }),
          ],
        }),
        buildGroupItem({
          linkId: "tab-contact",
          text: "Contact",
          item: [
            buildQuestionItem({
              linkId: "email-tab",
              text: "Email",
              type: "string",
              control: "text-box",
            }),
            buildQuestionItem({
              linkId: "phone-tab",
              text: "Phone",
              type: "string",
              control: "text-box",
            }),
          ],
        }),
      ],
    }),
  ),
};
