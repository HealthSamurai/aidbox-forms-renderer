import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

describe("disabledDisplay hidden", () => {
  it("treats disabled items as hidden when disabledDisplay is hidden", () => {
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
          disabledDisplay: "hidden",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    assertQuestionNode(control);
    assertQuestionNode(dependent);

    expect(dependent.isEnabled).toBe(false);
    expect(dependent.hidden).toBe(true);

    const controlAnswer = control.answers[0];
    assertDefined(controlAnswer);
    controlAnswer.setValueByUser(true);

    expect(dependent.isEnabled).toBe(true);
    expect(dependent.hidden).toBe(false);
  });
});
