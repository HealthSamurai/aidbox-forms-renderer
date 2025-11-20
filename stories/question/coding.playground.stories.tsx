import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import type { Questionnaire, Coding } from "fhir/r5";
import {
  PlaygroundRenderer,
  baseParameters,
  buildPlaygroundQuestionnaire,
  playgroundArgTypes,
  type PlaygroundArgsBase,
} from "../helpers.tsx";

type CodingStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES: Coding[] = [
  { system: "http://loinc.org", code: "1234-5", display: "Example code" },
  {
    system: "http://snomed.info/sct",
    code: "11110000",
    display: "SNOMED sample",
  },
];

function buildQuestionnaire(args: CodingStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "coding",
    label: "Coding question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function CodingPlaygroundView(args: CodingStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<CodingStoryArgs> = {
  title: "Question/Coding",
  component: CodingPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for coding questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<CodingStoryArgs>;

export default meta;

type Story = StoryObj<CodingStoryArgs>;

export const Playground: Story = {
  render: (args) => <CodingPlaygroundView {...args} />,
};
