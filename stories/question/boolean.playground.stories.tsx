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

type BooleanStoryArgs = PlaygroundArgsBase;

function buildQuestionnaire(args: BooleanStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "boolean",
    label: "Boolean question",
    answerValues: [true, false],
    ...args,
  });
}

function BooleanPlaygroundView(args: BooleanStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<BooleanStoryArgs> = {
  title: "Question/Boolean",
  component: BooleanPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for boolean questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<BooleanStoryArgs>;

export default meta;

type Story = StoryObj<BooleanStoryArgs>;

export const Playground: Story = {
  render: (args) => <BooleanPlaygroundView {...args} />,
};
