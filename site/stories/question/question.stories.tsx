import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  QuestionItemControl,
} from "@formbox/renderer/types.ts";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeAnswerOptions,
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";

type PlaygroundArguments = {
  itemControl: QuestionItemControl | "none";
  repeats: boolean;
  hasAnswerOptions: boolean;
  answerConstraint: "optionsOnly" | "optionsOrType" | "optionsOrString";
};

const playgroundArgumentTypes = {
  itemControl: {
    name: "Item control",
    options: [
      "none",
      "autocomplete",
      "drop-down",
      "check-box",
      "lookup",
      "radio-button",
      "slider",
      "spinner",
      "text-box",
    ],
    control: {
      type: "select",
      labels: {
        none: "None",
        autocomplete: "Autocomplete",
        "drop-down": "Drop-down",
        "check-box": "Check box",
        lookup: "Lookup",
        "radio-button": "Radio button",
        slider: "Slider",
        spinner: "Spinner",
        "text-box": "Text box",
      },
    },
    description: "Questionnaire itemControl extension (or none).",
  },
  repeats: {
    name: "Repeating question",
    control: { type: "boolean" },
    description: "Whether the question repeats.",
  },
  hasAnswerOptions: {
    name: "Has answer options",
    control: { type: "boolean" },
    description:
      "Include answerOption entries. Turn off to mimic 'without answer-options'.",
  },
  answerConstraint: {
    name: "Answer constraint",
    options: ["optionsOnly", "optionsOrType", "optionsOrString"],
    control: {
      type: "select",
      labels: {
        optionsOnly: "Options only",
        optionsOrType: "Options or type",
        optionsOrString: "Options or string",
      },
    },
    description:
      "Answer constraint profile; enabled only when options are present.",
    if: { arg: "hasAnswerOptions", truthy: true },
  },
} as const;

type PlaygroundConfig<T extends AnswerType> = {
  key: string;
  label: string;
  answerType: T;
  samples: Array<DataTypeToType<AnswerTypeToDataType<T>>>;
};

const PLAYGROUND_CONFIGS: PlaygroundConfig<AnswerType>[] = [
  {
    key: "Boolean",
    label: "Boolean question",
    answerType: "boolean",
    samples: [true, false],
  },
  {
    key: "Integer",
    label: "Integer question",
    answerType: "integer",
    samples: [0, 1, 2, 3],
  },
  {
    key: "Decimal",
    label: "Decimal question",
    answerType: "decimal",
    samples: [1.1, 2.5, 3.75],
  },
  {
    key: "String",
    label: "String question",
    answerType: "string",
    samples: ["Alpha", "Bravo", "Charlie"],
  },
  {
    key: "Text",
    label: "Text question",
    answerType: "text",
    samples: [
      "Lorem ipsum dolor sit amet.",
      "Consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt.",
    ],
  },
  {
    key: "Date",
    label: "Date question",
    answerType: "date",
    samples: ["2024-01-01", "2024-06-15", "2024-12-31"],
  },
  {
    key: "DateTime",
    label: "DateTime question",
    answerType: "dateTime",
    samples: [
      "2024-01-01T09:00:00Z",
      "2024-06-15T14:30:00Z",
      "2024-12-31T23:59:00Z",
    ],
  },
  {
    key: "Time",
    label: "Time question",
    answerType: "time",
    samples: ["08:00:00", "12:30:00", "18:45:00"],
  },
  {
    key: "Quantity",
    label: "Quantity question",
    answerType: "quantity",
    samples: [
      { value: 1, unit: "mg", system: "http://unitsofmeasure.org", code: "mg" },
      { value: 5, unit: "kg", system: "http://unitsofmeasure.org", code: "kg" },
      {
        value: 10,
        unit: "mL",
        system: "http://unitsofmeasure.org",
        code: "mL",
      },
    ],
  },
  {
    key: "Coding",
    label: "Coding question",
    answerType: "coding",
    samples: [
      { system: "http://loinc.org", code: "1234-5", display: "Example code" },
      {
        system: "http://snomed.info/sct",
        code: "11110000",
        display: "SNOMED sample",
      },
    ],
  },
  {
    key: "Reference",
    label: "Reference question",
    answerType: "reference",
    samples: [
      { reference: "Patient/example", display: "Jane Doe" },
      { reference: "Patient/alpha", display: "John Doe" },
    ],
  },
  {
    key: "Url",
    label: "URL question",
    answerType: "url",
    samples: [
      "https://example.org",
      "https://healthsamurai.com",
      "https://tx.fhir.org",
    ],
  },
  {
    key: "Attachment",
    label: "Attachment question",
    answerType: "attachment",
    samples: [
      {
        contentType: "text/plain",
        url: "https://example.org/doc.txt",
        title: "Sample document",
      },
      {
        contentType: "image/png",
        url: "https://example.org/image.png",
        title: "Sample image",
      },
    ],
  },
];

const meta: Meta<PlaygroundArguments> = {
  title: "Questions",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Single playground covering all question types. Use Controls to explore item-control, repeating, and answer constraint combinations.",
      },
    },
  },
  argTypes: playgroundArgumentTypes,
  args: {
    itemControl: "none",
    repeats: false,
    answerConstraint: "optionsOnly",
    hasAnswerOptions: false,
  },
};

export default meta;

function makeStory<T extends AnswerType>(
  config: PlaygroundConfig<T>,
): StoryObj<PlaygroundArguments> {
  return {
    name: config.label,
    render: (arguments_, context) => {
      const item = buildQuestionItem({
        linkId: `${config.answerType}-playground`,
        text: config.label,
        type: config.answerType,
        repeats: arguments_.repeats,
        control:
          arguments_.itemControl === "none"
            ? undefined
            : arguments_.itemControl,
        answerConstraint: arguments_.hasAnswerOptions
          ? arguments_.answerConstraint
          : undefined,
        answerOption: arguments_.hasAnswerOptions
          ? makeAnswerOptions(config.answerType, config.samples)
          : undefined,
      });
      const questionnaire = buildQuestionnaire(item);

      return (
        <Renderer
          questionnaire={questionnaire}
          storyId={context.id}
          mode="node"
        />
      );
    },
  };
}

export const Boolean: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[0],
);
export const Integer: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[1],
);
export const Decimal: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[2],
);
export const String: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[3],
);
export const Text: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[4],
);
export const Date: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[5],
);
export const DateTime: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[6],
);
export const Time: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[7],
);
export const Quantity: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[8],
);
export const Coding: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[9],
);
export const Reference: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[10],
);
export const Url: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[11],
);
export const Attachment: StoryObj<PlaygroundArguments> = makeStory(
  PLAYGROUND_CONFIGS[12],
);
