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

type DateStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = ["2024-01-01", "2024-06-15", "2024-12-31"];

function buildQuestionnaire(args: DateStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "date",
    label: "Date question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function DatePlaygroundView(args: DateStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<DateStoryArgs> = {
  title: "Question/Date",
  component: DatePlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for date questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<DateStoryArgs>;

export default meta;

type Story = StoryObj<DateStoryArgs>;

export const Playground: Story = {
  render: (args) => <DatePlaygroundView {...args} />,
};
