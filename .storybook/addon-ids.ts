import type { QuestionnaireResponse } from "fhir/r5";

export const QUESTIONNAIRE_RESPONSE_ADDON_ID = "aidbox/questionnaire-response";
export const QUESTIONNAIRE_RESPONSE_PANEL_ID = `${QUESTIONNAIRE_RESPONSE_ADDON_ID}/panel`;
export const QUESTIONNAIRE_RESPONSE_EVENT_ID = `${QUESTIONNAIRE_RESPONSE_ADDON_ID}/update`;

export type QuestionnaireResponseEventPayload = {
  storyId?: string | undefined;
  response: QuestionnaireResponse | null;
};
