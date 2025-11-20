import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import type { Questionnaire, Reference } from "fhir/r5";
import {
  PlaygroundRenderer,
  baseParameters,
  buildPlaygroundQuestionnaire,
  playgroundArgTypes,
  type PlaygroundArgsBase,
} from "../helpers.tsx";

type ReferenceStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES: Reference[] = [
  { reference: "Patient/example", display: "Jane Doe" },
  { reference: "Patient/alpha", display: "John Doe" },
];

function buildQuestionnaire(args: ReferenceStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "reference",
    label: "Reference question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function ReferencePlaygroundView(args: ReferenceStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<ReferenceStoryArgs> = {
  title: "Question/Reference",
  component: ReferencePlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for reference questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<ReferenceStoryArgs>;

export default meta;

type Story = StoryObj<ReferenceStoryArgs>;

export const Playground: Story = {
  render: (args) => <ReferencePlaygroundView {...args} />,
};
