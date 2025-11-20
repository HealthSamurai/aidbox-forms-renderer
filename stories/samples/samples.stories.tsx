import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Questionnaire } from "fhir/r5";
import { useEffect, useMemo } from "react";
import { addons } from "storybook/preview-api";

import Renderer from "../../lib";
import { samples } from "./data";
import { QUESTIONNAIRE_RESPONSE_EVENT_ID } from "../../.storybook/addon-ids.ts";

const DEFAULT_TERMINOLOGY_SERVER_URL = "https://tx.fhir.org/r5";

type SampleStoryArgs = {
  questionnaireSource: string;
  defaultQuestionnaire: Questionnaire;
  terminologyServerUrl: string;
};

type SampleStoryProps = SampleStoryArgs & { storyId: string };

function SampleStoryView({
  questionnaireSource,
  defaultQuestionnaire,
  terminologyServerUrl,
  storyId,
}: SampleStoryProps) {
  const channel = addons.getChannel();

  const { questionnaire, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(questionnaireSource) as Questionnaire;
      if (parsed.resourceType !== "Questionnaire") {
        throw new Error("JSON is not a Questionnaire resource");
      }

      return { questionnaire: parsed, error: null as string | null };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      return { questionnaire: defaultQuestionnaire, error: message };
    }
  }, [defaultQuestionnaire, questionnaireSource]);

  useEffect(() => {
    channel.emit(QUESTIONNAIRE_RESPONSE_EVENT_ID, {
      storyId,
      response: null,
    });

    return () => {
      channel.emit(QUESTIONNAIRE_RESPONSE_EVENT_ID, {
        storyId,
        response: null,
      });
    };
  }, [channel, storyId]);

  return (
    <div style={{ padding: 16 }}>
      <Renderer
        questionnaire={questionnaire}
        terminologyServerUrl={terminologyServerUrl}
        onChange={(response) =>
          channel.emit(QUESTIONNAIRE_RESPONSE_EVENT_ID, {
            storyId,
            response,
          })
        }
        onSubmit={(response) =>
          channel.emit(QUESTIONNAIRE_RESPONSE_EVENT_ID, {
            storyId,
            response,
          })
        }
      />
      {error ? (
        <p style={{ marginTop: 12, color: "#b91c1c" }}>
          Falling back to sample default because: {error}
        </p>
      ) : null}
    </div>
  );
}

const meta = {
  title: "Samples",
  parameters: {
    layout: "fullscreen",
    controls: { exclude: ["questionnaireSource", "defaultQuestionnaire"] },
  },
  argTypes: {
    questionnaireSource: {
      control: { disable: true },
      table: { disable: true },
    },
    defaultQuestionnaire: { table: { disable: true } },
  },
} satisfies Meta<SampleStoryArgs>;

export default meta;

type Story = StoryObj<SampleStoryArgs>;

function findSample(sampleId: string) {
  const sample = samples.find((entry) => entry.id === sampleId);
  if (!sample) {
    throw new Error(`Unknown sample id: ${sampleId}`);
  }
  return sample;
}

function makeStory(sampleId: string): Story {
  const sample = findSample(sampleId);
  const questionnaireSource = JSON.stringify(sample.questionnaire, null, 2);

  return {
    name: sample.label,
    args: {
      questionnaireSource,
      defaultQuestionnaire: sample.questionnaire,
      terminologyServerUrl: DEFAULT_TERMINOLOGY_SERVER_URL,
    },
    render: (args, context) => (
      <SampleStoryView {...args} storyId={context.id} />
    ),
  };
}

export const BasicTextInputs = makeStory("text-controls");
export const BooleanEnableWhen = makeStory("boolean-gating");
export const NumericThresholds = makeStory("numeric-thresholds");
export const NumericUnits = makeStory("numeric-units");
export const QuantityUnitOptions = makeStory("quantity-unit-options");
export const HelpControls = makeStory("item-control-help");
export const RepeatingQuestionAnswers = makeStory("repeating-question");
export const RepeatingGroupInstances = makeStory("repeating-group");
export const NestedFollowUps = makeStory("nested-follow-ups");
export const StaticInitials = makeStory("static-initials");
export const ExpressionInitialDefaults = makeStory("expression-initial");
export const ExpressionCalculated = makeStory("expression-calculated");
export const ExpressionEnableWhen = makeStory("expression-enable-when");
export const ExpressionDynamicBounds = makeStory("expression-dynamic-bounds");
export const ExpressionDynamicBehavior = makeStory(
  "expression-dynamic-behavior",
);
export const ExpressionDynamicQuantity = makeStory(
  "expression-dynamic-quantity",
);
export const AnswerOptions = makeStory("answer-options");
export const AnswerExpressions = makeStory("answer-expression");
export const Validation = makeStory("validation");
export const TargetConstraints = makeStory("target-constraint");
export const AnswerConstraints = makeStory("answer-constraint");
export const AnswerValueSet = makeStory("answer-valueset");
export const ItemControlMatrix = makeStory("item-control-matrix");
