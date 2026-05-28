import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined, EXT } from "@formbox/renderer/utilities.ts";
import en from "@formbox/strings/en";

import type { QuestionnaireOf } from "@formbox/renderer";

type Questionnaire = QuestionnaireOf<"r5">;

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  status: "active",
  extension: [{ url: EXT.SIGNATURE_REQUIRED }],
  item: [
    {
      linkId: "encounter-note",
      text: "Encounter note",
      type: "text",
    },
  ],
};

describe("signatureRequired", () => {
  it("requires questionnaire signature when the response has content", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = form.scope.lookupNode("encounter-note");
    assertQuestionNode(question);

    const answer = question.answers[0];
    assertDefined(answer);
    answer.setValueByUser("Follow-up needed.");

    expect(form.validateAll()).toBe(false);
    expect(
      form.issues.some((issue) =>
        issue.diagnostics?.includes("Signature is required."),
      ),
    ).toBe(true);

    form.setSignature({
      sigFormat: "image/png",
      data: "ZmFrZS1zaWduYXR1cmU=",
    });
    expect(form.validateAll()).toBe(true);
  });
});
