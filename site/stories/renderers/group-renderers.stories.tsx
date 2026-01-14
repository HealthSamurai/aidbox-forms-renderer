import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Extension, Questionnaire, QuestionnaireItem } from "fhir/r5";
import { useEffect, useMemo } from "react";
import { styled } from "@linaria/react";
import { Form } from "@aidbox-forms/renderer/component/form/form.tsx";
import { FormStore } from "@aidbox-forms/renderer/store/form/form-store.ts";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  GroupItemControl,
  QuestionItemControl,
} from "@aidbox-forms/renderer/types.ts";
import { EXT, ITEM_CONTROL_SYSTEM } from "@aidbox-forms/renderer/utilities.ts";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeAnswerOptions,
  makeInitialValues,
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "../story-channel-hooks.ts";

type GroupItemConfig = {
  linkId: string;
  text?: string | undefined;
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

const headerStoryItems: QuestionnaireItem[] = [
  {
    linkId: "header-story-note",
    text: "Please review the following information before you start. This header stays visible so you can always see the clinic name, visit context, and any time-sensitive instructions while you complete the form.",
    type: "display",
  },
];

const footerStoryItems: QuestionnaireItem[] = [
  {
    linkId: "footer-story-note",
    text: "If you need help, contact the front desk or pause and return later. This footer remains visible so you can quickly find support details and consent reminders at any point.",
    type: "display",
  },
];

function buildPageQuestions(
  prefix: string,
  label: string,
): QuestionnaireItem[] {
  const buildPageItem = (
    suffix: string,
    text: string,
    type: AnswerType,
    control?: QuestionItemControl,
  ) =>
    buildQuestionItem({
      linkId: `${prefix}-${suffix}`,
      text,
      type,
      control,
    });

  switch (label) {
    case "Demographics": {
      return [
        buildPageItem("first-name", "First name", "string", "text-box"),
        buildPageItem("last-name", "Last name", "string", "text-box"),
        buildPageItem("date-of-birth", "Date of birth", "date"),
        buildPageItem("sex-at-birth", "Sex at birth", "string", "text-box"),
        buildPageItem("mobile-phone", "Mobile phone", "string", "text-box"),
        buildPageItem("email", "Email", "string", "text-box"),
      ];
    }
    case "Current medications": {
      return [
        buildPageItem(
          "medication-name",
          "Medication name",
          "string",
          "text-box",
        ),
        buildPageItem("dose-mg", "Dose (mg)", "integer", "spinner"),
        buildPageItem("frequency", "Frequency", "string", "text-box"),
        buildPageItem("route", "Route", "string", "text-box"),
        buildPageItem("start-date", "Start date", "date"),
        buildPageItem("still-taking", "Still taking", "boolean", "check-box"),
      ];
    }
    case "Intake details": {
      return [
        buildPageItem(
          "reason-for-visit",
          "Reason for visit",
          "text",
          "text-box",
        ),
        buildPageItem("symptom-onset", "Symptom onset", "date"),
        buildPageItem("pain-level", "Pain level (0-10)", "integer", "spinner"),
        buildPageItem("temperature", "Temperature (C)", "decimal"),
        buildPageItem("visit-type", "Visit type", "string", "text-box"),
        buildPageItem(
          "consent-to-treat",
          "Consent to treatment",
          "boolean",
          "check-box",
        ),
      ];
    }
    case "Medical history": {
      return [
        buildPageItem("allergies", "Allergies", "text", "text-box"),
        buildPageItem(
          "chronic-conditions",
          "Chronic conditions",
          "text",
          "text-box",
        ),
        buildPageItem("past-surgeries", "Past surgeries", "text", "text-box"),
        buildPageItem("family-history", "Family history", "text", "text-box"),
        buildPageItem("tobacco-use", "Tobacco use", "string", "text-box"),
        buildPageItem("alcohol-use", "Alcohol use", "string", "text-box"),
      ];
    }
    case "Care plan": {
      return [
        buildPageItem("primary-goal", "Primary goal", "text", "text-box"),
        buildPageItem("target-date", "Target date", "date"),
        buildPageItem(
          "assigned-clinician",
          "Assigned clinician",
          "string",
          "text-box",
        ),
        buildPageItem("follow-up", "Follow-up interval", "string", "text-box"),
        buildPageItem(
          "needs-referral",
          "Needs referral",
          "boolean",
          "check-box",
        ),
        buildPageItem("care-plan-notes", "Care plan notes", "text", "text-box"),
      ];
    }
    default: {
      return [
        buildPageItem("details", "Details", "text", "text-box"),
        buildPageItem("notes", "Additional notes", "text", "text-box"),
        buildPageItem(
          "follow-up-needed",
          "Follow-up needed",
          "boolean",
          "check-box",
        ),
      ];
    }
  }
}

type TableOptionOverlap = "exact" | "overlap" | "sparse";
type TableAnswerType = AnswerType;
type TableSelectionMode = "single" | "multi" | "mixed";
type TableInitialSelection = "none" | "partial" | "full";
type TableMaxSelections = "none" | "1" | "2";
type GridQuestionOverlap = "exact" | "overlap" | "sparse";

type TableOptionValue<T extends TableAnswerType> = DataTypeToType<
  AnswerTypeToDataType<T>
>;
type TableOptionSet<T> = Record<TableOptionOverlap, T[][]>;

const answerTypeOptions = [
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
] as const;

const tableQuestionSpecs = [
  { linkId: "taste", text: "Taste" },
  { linkId: "color", text: "Color" },
  { linkId: "size", text: "Size" },
  { linkId: "shape", text: "Shape" },
  { linkId: "texture", text: "Texture" },
];

const gridQuestionSpecs: Array<{
  linkId: string;
  text: string;
  type: TableAnswerType;
}> = [
  { linkId: "grid-string", text: "String", type: "string" },
  { linkId: "grid-text", text: "Text", type: "text" },
  { linkId: "grid-integer", text: "Integer", type: "integer" },
  { linkId: "grid-decimal", text: "Decimal", type: "decimal" },
  { linkId: "grid-boolean", text: "Boolean", type: "boolean" },
  { linkId: "grid-date", text: "Date", type: "date" },
  { linkId: "grid-date-time", text: "DateTime", type: "dateTime" },
  { linkId: "grid-time", text: "Time", type: "time" },
  { linkId: "grid-url", text: "URL", type: "url" },
  { linkId: "grid-coding", text: "Coding", type: "coding" },
  { linkId: "grid-reference", text: "Reference", type: "reference" },
  { linkId: "grid-attachment", text: "Attachment", type: "attachment" },
  { linkId: "grid-quantity", text: "Quantity", type: "quantity" },
];

const gridRowLabels = ["Morning", "Afternoon", "Evening"];

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
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
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

function buildGridQuestionOverlapSets(
  total: number,
  overlap: GridQuestionOverlap,
) {
  const allIndexes = Array.from({ length: total }, (_item, index) => index);
  if (total === 0) {
    return gridRowLabels.map(() => []);
  }
  if (overlap === "exact") {
    return gridRowLabels.map(() => allIndexes);
  }
  if (overlap === "sparse") {
    const chunk = Math.ceil(total / gridRowLabels.length);
    return gridRowLabels.map((_label, index) => {
      const start = index * chunk;
      return allIndexes.slice(start, start + chunk);
    });
  }

  const windowSize = Math.min(5, total);
  if (total <= windowSize) {
    return gridRowLabels.map(() => allIndexes);
  }
  const middleStart = Math.floor((total - windowSize) / 2);
  const lastStart = Math.max(0, total - windowSize);
  return [
    allIndexes.slice(0, windowSize),
    allIndexes.slice(middleStart, middleStart + windowSize),
    allIndexes.slice(lastStart, lastStart + windowSize),
  ];
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
    render: (_arguments, context) => (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    ),
  };
}

function FormStory({
  questionnaire,
  storyId,
}: {
  questionnaire: Questionnaire;
  storyId: string;
}) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);

  useEffect(() => () => store.dispose(), [store]);

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  return (
    <FormStoryFrame>
      <Form store={store} onSubmit={() => store.validateAll()} />
    </FormStoryFrame>
  );
}

const FormStoryFrame = styled.div`
  width: 100%;
`;

type TableGroupArguments = {
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

const tableGroupArgumentTypes = {
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
    options: answerTypeOptions,
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
} as const;

type GridGroupArguments = {
  questionTypes: TableAnswerType[];
  questionOverlap: GridQuestionOverlap;
  readOnly: boolean;
};

const gridGroupArgumentTypes = {
  questionTypes: {
    name: "Question types",
    options: answerTypeOptions,
    control: { type: "multi-select" },
  },
  questionOverlap: {
    name: "Question overlap",
    options: ["exact", "overlap", "sparse"],
    control: { type: "select" },
  },
  readOnly: {
    name: "Read-only",
    control: { type: "boolean" },
  },
} as const;

type TabLabelStyle = "short" | "long" | "mixed";

type TabContainerGroupArguments = {
  tabCount: number;
  labelStyle: TabLabelStyle;
};

const tabContainerArgumentTypes = {
  tabCount: {
    name: "Tab count",
    control: { type: "range", min: 2, max: 12, step: 1 },
  },
  labelStyle: {
    name: "Label length",
    options: ["short", "long", "mixed"],
    control: { type: "select" },
  },
} as const;

function buildTabLabel(index: number, style: TabLabelStyle) {
  const shortLabels = [
    "Overview",
    "Profile",
    "Security",
    "Billing",
    "Team",
    "Activity",
    "Alerts",
    "Support",
    "Preferences",
    "Integrations",
    "Audit",
    "Usage",
  ];
  const longLabels = [
    "Overview and quick metrics",
    "Profile and account details",
    "Security and access controls",
    "Billing and invoice settings",
    "Team members and permissions",
    "Activity history and logs",
    "Alerts and notification rules",
    "Support and service contacts",
    "Preferences and appearance",
    "Integrations and webhooks",
    "Audit trail and compliance",
    "Usage and plan limits",
  ];
  const shortLabel = shortLabels[index % shortLabels.length];
  const longLabel = longLabels[index % longLabels.length];

  if (style === "short") {
    return shortLabel;
  }

  if (style === "long") {
    return longLabel;
  }

  return index % 2 === 0 ? shortLabel : longLabel;
}

function buildTabItems(
  tabCount: number,
  labelStyle: TabLabelStyle,
): QuestionnaireItem[] {
  const count = Math.max(1, Math.floor(tabCount));
  return Array.from({ length: count }, (_, index) => {
    const tabIndex = index + 1;
    return buildGroupItem({
      linkId: `tab-${tabIndex}`,
      text: buildTabLabel(index, labelStyle),
      item: [
        buildQuestionItem({
          linkId: `tab-${tabIndex}-field`,
          text: `Field ${tabIndex}`,
          type: "string",
          control: "text-box",
        }),
      ],
    });
  });
}

export const DefaultGroupRenderer = {
  name: "Default",
  ...makeStory(
    buildGroupItem({
      linkId: "group-default",
      text: "Default",
      item: baseQuestions,
    }),
  ),
};

export const TableGroupRenderer = {
  name: "Table",
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
  argTypes: tableGroupArgumentTypes,
  render: (arguments_: TableGroupArguments, context) => {
    const control =
      arguments_.orientation === "horizontal" ? "htable" : "table";
    const maxSelections =
      arguments_.maxSelections === "none"
        ? undefined
        : Number(arguments_.maxSelections);
    const tableQuestions = buildTableQuestions({
      answerType: arguments_.answerType,
      questionCount: arguments_.questionCount,
      optionCount: arguments_.optionCount,
      optionOverlap: arguments_.optionOverlap,
      selectionMode: arguments_.selectionMode,
      maxSelections,
      initialSelection: arguments_.initialSelection,
    });
    const item = buildGroupItem({
      linkId: "group-table",
      text: "Selection table",
      control,
      readOnly: arguments_.readOnly,
      item: tableQuestions,
    });
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
} satisfies StoryObj<TableGroupArguments>;

export const GridGroupRenderer = {
  name: "Grid",
  args: {
    questionTypes: ["string", "boolean", "time", "attachment"],
    questionOverlap: "overlap",
    readOnly: false,
  },
  argTypes: gridGroupArgumentTypes,
  render: (arguments_: GridGroupArguments, context) => {
    const questionPool = gridQuestionSpecs.filter((question) =>
      arguments_.questionTypes.includes(question.type),
    );
    const questionIndexes = buildGridQuestionOverlapSets(
      questionPool.length,
      arguments_.questionOverlap,
    );
    const rows = gridRowLabels.map((rowLabel, rowIndex) => {
      const rowQuestionIndexes = questionIndexes[rowIndex] ?? [];
      return buildGroupItem({
        linkId: `row-${rowIndex + 1}`,
        text: rowLabel,
        item: rowQuestionIndexes
          .map((questionIndex) => questionPool[questionIndex])
          .filter(Boolean)
          .map((question) =>
            buildQuestionItem({
              linkId: question.linkId,
              text: question.text,
              type: question.type,
            }),
          ),
      });
    });

    const item = buildGroupItem({
      linkId: "group-grid",
      text: "Daily check-in",
      control: "grid",
      readOnly: arguments_.readOnly,
      item: rows,
    });
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
} satisfies StoryObj<GridGroupArguments>;

export const GridTableGroupRenderer = {
  name: "Grid Table",
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

export const HeaderGroupRenderer: StoryObj = {
  name: "Header",
  render: (_arguments, context) => (
    <FormStory
      questionnaire={{
        resourceType: "Questionnaire",
        status: "active",
        item: [
          buildGroupItem({
            linkId: "group-header",
            control: "header",
            item: headerStoryItems,
          }),
          buildGroupItem({
            linkId: "header-page-demographics",
            text: "Demographics",
            control: "page",
            item: buildPageQuestions(
              "header-page-demographics",
              "Demographics",
            ),
          }),
          buildGroupItem({
            linkId: "header-page-medications",
            text: "Current medications",
            control: "page",
            item: buildPageQuestions(
              "header-page-medications",
              "Current medications",
            ),
          }),
        ],
      }}
      storyId={context.id}
    />
  ),
};

export const FooterGroupRenderer: StoryObj = {
  name: "Footer",
  render: (_arguments, context) => (
    <FormStory
      questionnaire={{
        resourceType: "Questionnaire",
        status: "active",
        item: [
          buildGroupItem({
            linkId: "footer-page-intake",
            text: "Intake details",
            control: "page",
            item: buildPageQuestions("footer-page-intake", "Intake details"),
          }),
          buildGroupItem({
            linkId: "footer-page-history",
            text: "Medical history",
            control: "page",
            item: buildPageQuestions("footer-page-history", "Medical history"),
          }),
          buildGroupItem({
            linkId: "group-footer",
            control: "footer",
            item: footerStoryItems,
          }),
        ],
      }}
      storyId={context.id}
    />
  ),
};

export const PageGroupRenderer: StoryObj = {
  name: "Page",
  render: (_arguments, context) => (
    <FormStory
      questionnaire={{
        resourceType: "Questionnaire",
        status: "active",
        item: [
          buildGroupItem({
            linkId: "group-page-demographics",
            text: "Demographics",
            control: "page",
            item: buildPageQuestions("page-story-demographics", "Demographics"),
          }),
          buildGroupItem({
            linkId: "group-page-care-plan",
            text: "Care plan",
            control: "page",
            item: buildPageQuestions("page-story-care-plan", "Care plan"),
          }),
        ],
      }}
      storyId={context.id}
    />
  ),
};

export const TabContainerGroupRenderer = {
  name: "Tabs",
  args: {
    tabCount: 3,
    labelStyle: "mixed",
  },
  argTypes: tabContainerArgumentTypes,
  render: (arguments_: TabContainerGroupArguments, context) => {
    const item = buildGroupItem({
      linkId: "group-tabs",
      text: "Profile",
      control: "tab-container",
      item: buildTabItems(arguments_.tabCount, arguments_.labelStyle),
    });

    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
} satisfies StoryObj<TabContainerGroupArguments>;
