import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import type { Questionnaire, Attachment } from "fhir/r5";
import {
  PlaygroundRenderer,
  baseParameters,
  buildPlaygroundQuestionnaire,
  playgroundArgTypes,
  type PlaygroundArgsBase,
} from "../helpers.tsx";

type AttachmentStoryArgs = PlaygroundArgsBase;

const SAMPLE_VALUES: Attachment[] = [
  {
    contentType: "text/plain",
    url: "https://example.org/doc.txt",
    title: "Sample document",
  },
  {
    contentType: "image/png",
    url: "https://example.org/image.png",
    title: "Sample image",
  },
];

function buildQuestionnaire(args: AttachmentStoryArgs): Questionnaire {
  return buildPlaygroundQuestionnaire({
    answerType: "attachment",
    label: "Attachment question",
    answerValues: SAMPLE_VALUES,
    ...args,
  });
}

function AttachmentPlaygroundView(args: AttachmentStoryArgs) {
  const questionnaire = useMemo(() => buildQuestionnaire(args), [args]);
  return <PlaygroundRenderer questionnaire={questionnaire} />;
}

const meta: Meta<AttachmentStoryArgs> = {
  title: "Question/Attachment",
  component: AttachmentPlaygroundView,
  parameters: {
    ...baseParameters,
    docs: {
      description: {
        component:
          "Single playground for attachment questions. Use Controls to explore item-control, repeating, and answer constraint combinations instead of separate files.",
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
} satisfies Meta<AttachmentStoryArgs>;

export default meta;

type Story = StoryObj<AttachmentStoryArgs>;

export const Playground: Story = {
  render: (args) => <AttachmentPlaygroundView {...args} />,
};
