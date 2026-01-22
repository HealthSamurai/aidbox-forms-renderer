import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";

describe("QuestionnaireResponse", () => {
  it("reproduces seeded QuestionnaireResponse content", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/prepopulated",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "description",
              text: "Description",
              type: "text",
            },
            {
              linkId: "onset",
              text: "Onset date",
              type: "date",
            },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          type: "boolean",
        },
      ],
    };

    const initialResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/prepopulated",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Fever" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-01" }],
            },
          ],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Cough" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-03" }],
            },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          answer: [{ valueBoolean: true }],
        },
      ],
    };

    const form = new FormStore(questionnaire, initialResponse);

    expect(form.response).toEqual(initialResponse);
  });
});
