import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
describe("disabledDisplay protected", () => {
  it("does not hide disabled items when disabledDisplay is protected", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "control",
          type: "boolean",
          text: "Control",
        },
        {
          linkId: "dependent",
          type: "string",
          text: "Dependent",
          enableWhen: [
            {
              question: "control",
              operator: "=",
              answerBoolean: true,
            },
          ],
          disabledDisplay: "protected",
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);
    expect(dependent.hidden).toBe(false);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(true);

    expect(dependent.isEnabled).toBe(true);
    expect(dependent.hidden).toBe(false);
  });
});
