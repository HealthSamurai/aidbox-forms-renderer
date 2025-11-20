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

type UrlStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES = [
  "https://example.org",
  "https://healthsamurai.com",
  "https://tx.fhir.org",
];

function buildQuestionnaire(args: UrlStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "url",
    label: "URL question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function UrlPlaygroundView(args: UrlStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<UrlStoryArgs> = {
  title: "Question/URL",
  component: UrlPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for URL questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<UrlStoryArgs>;

export default meta;

type Story = StoryObj<UrlStoryArgs>;

export const Playground: Story = {
  render: (args) => <UrlPlaygroundView {...args} />,
};
