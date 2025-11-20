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

type TimeStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = ["08:00:00", "12:30:00", "18:45:00"];

function buildQuestionnaire(args: TimeStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "time",
    label: "Time question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function TimePlaygroundView(args: TimeStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<TimeStoryArgs> = {
  title: "Question/Time",
  component: TimePlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for time questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<TimeStoryArgs>;

export default meta;

type Story = StoryObj<TimeStoryArgs>;

export const Playground: Story = {
  render: (args) => <TimePlaygroundView {...args} />,
};
