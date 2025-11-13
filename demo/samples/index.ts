import type { Questionnaire } from "fhir/r5";

import textControls from "./text-controls.json" assert { type: "json" };
import booleanGating from "./boolean-gating.json" assert { type: "json" };
import numericThresholds from "./numeric-thresholds.json" assert { type: "json" };
import numericUnits from "./numeric-units.json" assert { type: "json" };
import quantityUnitOptions from "./quantity-unit-options.json" assert { type: "json" };
import itemControlHelp from "./item-control-help.json" assert { type: "json" };
import repeatingQuestion from "./repeating-question.json" assert { type: "json" };
import repeatingGroup from "./repeating-group.json" assert { type: "json" };
import nestedFollowUps from "./nested-follow-ups.json" assert { type: "json" };
import staticInitials from "./static-initials.json" assert { type: "json" };
import expressionInitial from "./expression-initial.json" assert { type: "json" };
import expressionCalculated from "./expression-calculated.json" assert { type: "json" };
import expressionEnableWhen from "./expression-enable-when.json" assert { type: "json" };
import expressionDynamicBounds from "./expression-dynamic-bounds.json" assert { type: "json" };
import expressionDynamicBehavior from "./expression-dynamic-behavior.json" assert { type: "json" };
import expressionDynamicQuantity from "./expression-dynamic-quantity.json" assert { type: "json" };
import answerOptions from "./answer-options.json" assert { type: "json" };
import answerExpression from "./answer-expression.json" assert { type: "json" };
import validation from "./validation.json" assert { type: "json" };
import targetConstraint from "./target-constraint.json" assert { type: "json" };

type DemoSample = {
  readonly id: string;
  readonly label: string;
  readonly questionnaire: Questionnaire;
};

export const demoSamples: readonly DemoSample[] = [
  {
    id: "text-controls",
    label: "Basic text inputs",
    questionnaire: textControls as Questionnaire,
  },
  {
    id: "boolean-gating",
    label: "Boolean enableWhen",
    questionnaire: booleanGating as Questionnaire,
  },
  {
    id: "numeric-thresholds",
    label: "Numeric comparisons",
    questionnaire: numericThresholds as Questionnaire,
  },
  {
    id: "numeric-units",
    label: "Numeric units",
    questionnaire: numericUnits as Questionnaire,
  },
  {
    id: "quantity-unit-options",
    label: "Quantity unit options",
    questionnaire: quantityUnitOptions as Questionnaire,
  },
  {
    id: "item-control-help",
    label: "Help controls",
    questionnaire: itemControlHelp as Questionnaire,
  },
  {
    id: "repeating-question",
    label: "Repeating question answers",
    questionnaire: repeatingQuestion as Questionnaire,
  },
  {
    id: "repeating-group",
    label: "Repeating group instances",
    questionnaire: repeatingGroup as Questionnaire,
  },
  {
    id: "nested-follow-ups",
    label: "Nested follow-up questions",
    questionnaire: nestedFollowUps as Questionnaire,
  },
  {
    id: "static-initials",
    label: "Static initial values",
    questionnaire: staticInitials as Questionnaire,
  },
  {
    id: "expression-initial",
    label: "Initial expression defaults",
    questionnaire: expressionInitial as Questionnaire,
  },
  {
    id: "expression-calculated",
    label: "Calculated expressions",
    questionnaire: expressionCalculated as Questionnaire,
  },
  {
    id: "expression-enable-when",
    label: "Expression-based enablement",
    questionnaire: expressionEnableWhen as Questionnaire,
  },
  {
    id: "expression-dynamic-bounds",
    label: "Dynamic min/max expressions",
    questionnaire: expressionDynamicBounds as Questionnaire,
  },
  {
    id: "expression-dynamic-behavior",
    label: "Dynamic behavior expressions",
    questionnaire: expressionDynamicBehavior as Questionnaire,
  },
  {
    id: "expression-dynamic-quantity",
    label: "Dynamic quantity expressions",
    questionnaire: expressionDynamicQuantity as Questionnaire,
  },
  {
    id: "answer-options",
    label: "Answer options",
    questionnaire: answerOptions as Questionnaire,
  },
  {
    id: "answer-expression",
    label: "Answer expressions",
    questionnaire: answerExpression as Questionnaire,
  },
  {
    id: "validation",
    label: "Validation",
    questionnaire: validation as Questionnaire,
  },
  {
    id: "target-constraint",
    label: "Target constraints",
    questionnaire: targetConstraint as Questionnaire,
  },
] as const;
