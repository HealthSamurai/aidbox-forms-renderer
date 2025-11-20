import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import type { Questionnaire } from "fhir/r5";
import {
  PlaygroundRenderer,
  baseParameters,
  buildPlaygroundQuestionnaire,
  playgroundArgTypes,
  type PlaygroundArgsBase,
} from "../helpers.tsx";

type DateTimeStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = [
  "2024-01-01T09:00:00Z",
  "2024-06-15T14:30:00Z",
  "2024-12-31T23:59:00Z",
];

function buildQuestionnaire(args: DateTimeStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "dateTime",
    label: "DateTime question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function DateTimePlaygroundView(args: DateTimeStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<DateTimeStoryArgs> = {
  title: "Question/DateTime",
  component: DateTimePlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for dateTime questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
      },
    },
  },
  argTypes: {
    ...playgroundArgTypes,
  },
  args: {
    itemControl: "none",
    repeats: false,
    answerConstraint: "optionsOnly",
    hasAnswerOptions: false,
  },
} satisfies Meta<DateTimeStoryArgs>;

export default meta;

type Story = StoryObj<DateTimeStoryArgs>;

export const Playground: Story = {
  render: (args) => <DateTimePlaygroundView {...args} />,
};
