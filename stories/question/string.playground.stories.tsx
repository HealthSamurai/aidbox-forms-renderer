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

type StringStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = ["Alpha", "Bravo", "Charlie"];

function buildQuestionnaire(args: StringStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "string",
    label: "String question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function StringPlaygroundView(args: StringStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<StringStoryArgs> = {
  title: "Question/String",
  component: StringPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for string questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<StringStoryArgs>;

export default meta;

type Story = StoryObj<StringStoryArgs>;

export const Playground: Story = {
  render: (args) => <StringPlaygroundView {...args} />,
};
