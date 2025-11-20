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

type DecimalStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = [1.1, 2.5, 3.75];

function buildQuestionnaire(args: DecimalStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "decimal",
    label: "Decimal question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function DecimalPlaygroundView(args: DecimalStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<DecimalStoryArgs> = {
  title: "Question/Decimal",
  component: DecimalPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for decimal questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<DecimalStoryArgs>;

export default meta;

type Story = StoryObj<DecimalStoryArgs>;

export const Playground: Story = {
  render: (args) => <DecimalPlaygroundView {...args} />,
};
