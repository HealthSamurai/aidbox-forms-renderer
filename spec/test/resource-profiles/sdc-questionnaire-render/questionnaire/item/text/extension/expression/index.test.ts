import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCqfExpression,
  makeVariable,
} from "../../../../../../../utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
describe("item text expressions", () => {
  it("renders dynamic labels using expressions on _text", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "latestName",
              "%context.item.where(linkId='name').answer.valueString.last()",
            ),
          ],
          item: [
            {
              linkId: "name",
              text: "Respondent name",
              type: "string",
            },
            {
              linkId: "greeting",
              text: "Hello guest",
              _text: {
                extension: [
                  makeCqfExpression(
                    "iif(%latestName.exists(), 'Hello ' & %latestName, 'Hello guest')",
                  ),
                ],
              },
              type: "string",
            },
          ],
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
    const name = form.scope.lookupNode("name");
    const greeting = form.scope.lookupNode("greeting");

    assertQuestionNode(name);
    assertQuestionNode(greeting);

    expect(greeting.text).toBe("Hello guest");

    const nameAnswer = name.answers[0];
    assertDefined(nameAnswer);
    nameAnswer.setValueByUser("Ada");
    expect(greeting.text).toBe("Hello Ada");

    nameAnswer.setValueByUser("Lin");
    expect(greeting.text).toBe("Hello Lin");
  });

  it("records issues when _text expressions reference unavailable data", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "detail",
          text: "Static label",
          type: "string",
          _text: {
            extension: [makeCqfExpression("%missingLabel")],
          },
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
    const detail = form.scope.lookupNode("detail");

    assertQuestionNode(detail);

    void detail.text;

    const slot = detail.expressionRegistry.text;
    expect(slot).toBeDefined();
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate text expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it references unavailable data",
    );
  });
});
