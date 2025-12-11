import "../../lib/components/form/form.css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  Extension,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IPresentableNode,
  QuestionItemControl,
} from "../../lib/types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  EXT,
  ITEM_CONTROL_SYSTEM,
} from "../../lib/utils.ts";
import { useEffect, useMemo } from "react";
import { FormStore } from "../../lib/stores/form/form-store.ts";
import { Node } from "../../lib/components/form/node.tsx";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "../helpers.tsx";

type PlaygroundArgs = {
  itemControl: QuestionItemControl | "none";
  repeats: boolean;
  hasAnswerOptions: boolean;
  answerConstraint: "optionsOnly" | "optionsOrType" | "optionsOrString";
};

const playgroundArgTypes = {
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

function buildQuestionItem<T extends AnswerType>(options: {
  linkId: string;
  text: string;
  type: T;
  control?: QuestionItemControl | undefined;
  answerConstraint?: QuestionnaireItem["answerConstraint"];
  answerOption?: QuestionnaireItemAnswerOption[] | undefined;
  repeats?: boolean | undefined;
  extensions?: Extension[] | undefined;
  item?: QuestionnaireItem[] | undefined;
}): QuestionnaireItem {
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
  if (options.repeats) {
    extensions.push({
      url: EXT.MIN_OCCURS,
      valueInteger: 1,
    });
  }

  return {
    linkId: options.linkId,
    text: options.text,
    type: options.type,
    repeats: options.repeats,
    answerOption:
      options.answerOption && options.answerOption.length > 0
        ? options.answerOption
        : undefined,
    answerConstraint: options.answerConstraint,
    extension: extensions.length > 0 ? extensions : undefined,
    item: options.item,
  };
}

function makeAnswerOptions<T extends AnswerType>(
  type: T,
  values: Array<DataTypeToType<AnswerTypeToDataType<T>>>,
): QuestionnaireItemAnswerOption[] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[type];
  return values.map(
    (value) =>
      asAnswerFragment(dataType, value) as QuestionnaireItemAnswerOption,
  );
}

function buildQuestionnaire<T extends AnswerType>({
  answerType,
  label,
  itemControl,
  repeats,
  hasAnswerOptions,
  answerConstraint,
  answerValues,
}: PlaygroundArgs & {
  answerType: T;
  label: string;
  answerValues: Array<DataTypeToType<AnswerTypeToDataType<T>>>;
}): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      buildQuestionItem({
        linkId: `${answerType}-playground`,
        text: label,
        type: answerType,
        repeats,
        control: itemControl === "none" ? undefined : itemControl,
        answerConstraint: hasAnswerOptions ? answerConstraint : undefined,
        answerOption: hasAnswerOptions
          ? makeAnswerOptions(answerType, answerValues)
          : undefined,
      }),
    ],
  };
}

function Renderer({
  questionnaire,
  storyId,
}: {
  questionnaire: Questionnaire;
  storyId: string;
}) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);
  useEffect(() => () => store.dispose(), [store]);

  const node = store.nodes[0];

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  if (!node) {
    return <p>Questionnaire did not produce a node.</p>;
  }

  return (
    <div className="af-form" style={{ maxWidth: 760 }}>
      <Node node={node as IPresentableNode} />
    </div>
  );
}

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

const meta: Meta<PlaygroundArgs> = {
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
  argTypes: playgroundArgTypes,
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
): StoryObj<PlaygroundArgs> {
  return {
    name: config.label,
    render: (args, context) => {
      const questionnaire: Questionnaire = buildQuestionnaire({
        answerType: config.answerType,
        label: config.label,
        answerValues: config.samples,
        ...args,
      });

      return <Renderer questionnaire={questionnaire} storyId={context.id} />;
    },
  };
}

export const Boolean: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[0],
);
export const Integer: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[1],
);
export const Decimal: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[2],
);
export const String: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[3],
);
export const Text: StoryObj<PlaygroundArgs> = makeStory(PLAYGROUND_CONFIGS[4]);
export const Date: StoryObj<PlaygroundArgs> = makeStory(PLAYGROUND_CONFIGS[5]);
export const DateTime: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[6],
);
export const Time: StoryObj<PlaygroundArgs> = makeStory(PLAYGROUND_CONFIGS[7]);
export const Quantity: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[8],
);
export const Coding: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[9],
);
export const Reference: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[10],
);
export const Url: StoryObj<PlaygroundArgs> = makeStory(PLAYGROUND_CONFIGS[11]);
export const Attachment: StoryObj<PlaygroundArgs> = makeStory(
  PLAYGROUND_CONFIGS[12],
);
