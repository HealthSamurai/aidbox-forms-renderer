import type { Questionnaire } from "fhir/r5";

import textControls from "./text-controls.json" assert { type: "json" };
import booleanGating from "./boolean-gating.json" assert { type: "json" };
import numericThresholds from "./numeric-thresholds.json" assert { type: "json" };
import repeatingQuestion from "./repeating-question.json" assert { type: "json" };
import repeatingGroup from "./repeating-group.json" assert { type: "json" };
import nestedFollowUps from "./nested-follow-ups.json" assert { type: "json" };
import expressionInitial from "./expression-initial.json" assert { type: "json" };
import expressionCalculated from "./expression-calculated.json" assert { type: "json" };
import expressionEnableWhen from "./expression-enable-when.json" assert { type: "json" };
import expressionDynamicBounds from "./expression-dynamic-bounds.json" assert { type: "json" };

type DemoSample = {
  readonly id: string;
  readonly label: string;
  readonly questionnaire: Questionnaire;
};

export const demoSamples: readonly DemoSample[] = [
  {
    id: "text-controls",
    label: "1. Basic text inputs",
    questionnaire: textControls as Questionnaire,
  },
  {
    id: "boolean-gating",
    label: "2. Boolean enableWhen",
    questionnaire: booleanGating as Questionnaire,
  },
  {
    id: "numeric-thresholds",
    label: "3. Numeric comparisons",
    questionnaire: numericThresholds as Questionnaire,
  },
  {
    id: "repeating-question",
    label: "4. Repeating question answers",
    questionnaire: repeatingQuestion as Questionnaire,
  },
  {
    id: "repeating-group",
    label: "5. Repeating group instances",
    questionnaire: repeatingGroup as Questionnaire,
  },
  {
    id: "nested-follow-ups",
    label: "6. Nested follow-up questions",
    questionnaire: nestedFollowUps as Questionnaire,
  },
  {
    id: "expression-initial",
    label: "7. Initial expression defaults",
    questionnaire: expressionInitial as Questionnaire,
  },
  {
    id: "expression-calculated",
    label: "8. Calculated expressions",
    questionnaire: expressionCalculated as Questionnaire,
  },
  {
    id: "expression-enable-when",
    label: "9. Expression-based enablement",
    questionnaire: expressionEnableWhen as Questionnaire,
  },
  {
    id: "expression-dynamic-bounds",
    label: "10. Dynamic min/max expressions",
    questionnaire: expressionDynamicBounds as Questionnaire,
  },
] as const;
