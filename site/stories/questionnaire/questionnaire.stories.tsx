import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Questionnaire } from "fhir/r5";
import { useCallback, useEffect, useMemo } from "react";
import { styled } from "@linaria/react";

import { Form } from "@aidbox-forms/renderer/component/form/form.tsx";
import { FormStore } from "@aidbox-forms/renderer/store/form/form-store.ts";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "../story-channel-hooks.ts";
import answerConstraint from "./samples/answer-constraint-examples.json" with { type: "json" };
import answerExpression from "./samples/answer-expression.json" with { type: "json" };
import answerOptions from "./samples/answer-options.json" with { type: "json" };
import answerValueSet from "./samples/answer-valueset.json" with { type: "json" };
import booleanGating from "./samples/boolean-gating.json" with { type: "json" };
import expressionCalculated from "./samples/expression-calculated.json" with { type: "json" };
import expressionDynamicBehavior from "./samples/expression-dynamic-behavior.json" with { type: "json" };
import expressionDynamicBounds from "./samples/expression-dynamic-bounds.json" with { type: "json" };
import expressionDynamicQuantity from "./samples/expression-dynamic-quantity.json" with { type: "json" };
import expressionEnableWhen from "./samples/expression-enable-when.json" with { type: "json" };
import expressionInitial from "./samples/expression-initial.json" with { type: "json" };
import itemControlHelp from "./samples/item-control-help.json" with { type: "json" };
import itemControlMatrix from "./samples/item-control-matrix.json" with { type: "json" };
import nestedFollowUps from "./samples/nested-follow-ups.json" with { type: "json" };
import numericThresholds from "./samples/numeric-thresholds.json" with { type: "json" };
import numericUnits from "./samples/numeric-units.json" with { type: "json" };
import quantityUnitOptions from "./samples/quantity-unit-options.json" with { type: "json" };
import repeatingGroup from "./samples/repeating-group.json" with { type: "json" };
import repeatingQuestion from "./samples/repeating-question.json" with { type: "json" };
import staticInitials from "./samples/static-initials.json" with { type: "json" };
import targetConstraint from "./samples/target-constraint.json" with { type: "json" };
import textControls from "./samples/text-controls.json" with { type: "json" };
import validation from "./samples/validation.json" with { type: "json" };

type PlaygroundArguments = {
  questionnaire: Questionnaire;
};

function Renderer({
  questionnaire,
  storyId,
}: PlaygroundArguments & { storyId: string }) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);

  const handleSubmit = useCallback(() => {
    store.validateAll();
  }, [store]);

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  useEffect(() => () => store.dispose(), [store]);

  return (
    <StoryFrame>
      <Form store={store} onSubmit={handleSubmit} />
    </StoryFrame>
  );
}

const StoryFrame = styled.div`
  padding: 16px;
`;

const meta = {
  title: "Questionnaires",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    questionnaire: {
      control: { type: "object" },
      description: "Input questionnaire",
    },
  },
} satisfies Meta<PlaygroundArguments>;

export default meta;

function makeStory(
  label: string,
  questionnaire: Questionnaire,
): StoryObj<PlaygroundArguments> {
  return {
    name: label,
    args: { questionnaire },
    render: (arguments_, context) => {
      return <Renderer {...arguments_} storyId={context.id} />;
    },
  };
}

export const BasicTextInputs = makeStory(
  "Basic text inputs",
  textControls as Questionnaire,
);
export const BooleanEnableWhen = makeStory(
  "Boolean enableWhen",
  booleanGating as Questionnaire,
);
export const NumericThresholds = makeStory(
  "Numeric comparisons",
  numericThresholds as Questionnaire,
);
export const NumericUnits = makeStory(
  "Numeric units",
  numericUnits as Questionnaire,
);
export const QuantityUnitOptions = makeStory(
  "Quantity unit options",
  quantityUnitOptions as Questionnaire,
);
export const HelpControls = makeStory(
  "Help controls",
  itemControlHelp as Questionnaire,
);
export const RepeatingQuestionAnswers = makeStory(
  "Repeating question answers",
  repeatingQuestion as Questionnaire,
);
export const RepeatingGroupInstances = makeStory(
  "Repeating group instances",
  repeatingGroup as Questionnaire,
);
export const NestedFollowUps = makeStory(
  "Nested follow-up questions",
  nestedFollowUps as Questionnaire,
);
export const StaticInitials = makeStory(
  "Static initial values",
  staticInitials as Questionnaire,
);
export const ExpressionInitialDefaults = makeStory(
  "Initial expression defaults",
  expressionInitial as Questionnaire,
);
export const ExpressionCalculated = makeStory(
  "Calculated expressions",
  expressionCalculated as Questionnaire,
);
export const ExpressionEnableWhen = makeStory(
  "Expression-based enablement",
  expressionEnableWhen as Questionnaire,
);
export const ExpressionDynamicBounds = makeStory(
  "Dynamic min/max expressions",
  expressionDynamicBounds as Questionnaire,
);
export const ExpressionDynamicBehavior = makeStory(
  "Dynamic behavior expressions",
  expressionDynamicBehavior as Questionnaire,
);
export const ExpressionDynamicQuantity = makeStory(
  "Dynamic quantity expressions",
  expressionDynamicQuantity as Questionnaire,
);
export const AnswerOptions = makeStory(
  "Answer options",
  answerOptions as Questionnaire,
);
export const AnswerExpressions = makeStory(
  "Answer expressions",
  answerExpression as Questionnaire,
);
export const Validation = makeStory("Validation", validation as Questionnaire);
export const TargetConstraints = makeStory(
  "Target constraints",
  targetConstraint as Questionnaire,
);
export const AnswerConstraints = makeStory(
  "Answer constraints",
  answerConstraint as Questionnaire,
);
export const AnswerValueSet = makeStory(
  "Answer ValueSet",
  answerValueSet as Questionnaire,
);
export const ItemControlMatrix = makeStory(
  "Item control + constraint matrix",
  itemControlMatrix as Questionnaire,
);
