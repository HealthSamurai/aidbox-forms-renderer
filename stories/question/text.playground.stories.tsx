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

type TextStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = [
  "Lorem ipsum dolor sit amet.",
  "Consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt.",
];

function buildQuestionnaire(args: TextStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "text",
    label: "Text question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function TextPlaygroundView(args: TextStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<TextStoryArgs> = {
  title: "Question/Text",
  component: TextPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for text questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<TextStoryArgs>;

export default meta;

type Story = StoryObj<TextStoryArgs>;

export const Playground: Story = {
  render: (args) => <TextPlaygroundView {...args} />,
};
