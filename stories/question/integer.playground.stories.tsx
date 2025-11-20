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

type IntegerStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = [0, 1, 2, 3];

function buildQuestionnaire(args: IntegerStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "integer",
    label: "Integer question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function IntegerPlaygroundView(args: IntegerStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<IntegerStoryArgs> = {
  title: "Question/Integer",
  component: IntegerPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for integer questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<IntegerStoryArgs>;

export default meta;

type Story = StoryObj<IntegerStoryArgs>;

export const Playground: Story = {
  render: (args) => <IntegerPlaygroundView {...args} />,
};
