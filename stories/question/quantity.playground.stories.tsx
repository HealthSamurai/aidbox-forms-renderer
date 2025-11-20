import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import type { Questionnaire, Quantity } from "fhir/r5";
import {
  PlaygroundRenderer,
  baseParameters,
  buildPlaygroundQuestionnaire,
  playgroundArgTypes,
  type PlaygroundArgsBase,
} from "../helpers.tsx";

type QuantityStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES: Quantity[] = [
  { value: 1, unit: "mg", system: "http://unitsofmeasure.org", code: "mg" },
  { value: 5, unit: "kg", system: "http://unitsofmeasure.org", code: "kg" },
  { value: 10, unit: "mL", system: "http://unitsofmeasure.org", code: "mL" },
];

function buildQuestionnaire(args: QuantityStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "quantity",
    label: "Quantity question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function QuantityPlaygroundView(args: QuantityStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<QuantityStoryArgs> = {
  title: "Question/Quantity",
  component: QuantityPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for quantity questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<QuantityStoryArgs>;

export default meta;

type Story = StoryObj<QuantityStoryArgs>;

export const Playground: Story = {
  render: (args) => <QuantityPlaygroundView {...args} />,
};
