import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../form/form-store.ts";
import {
  makeCalculatedExpression,
  makeInitialExpression,
} from "../../../__tests__/test-utils/expression-fixtures.ts";
import { assertQuestionNode } from "../../question/question-store.ts";
import { assertGroupNode } from "../../group/group-store.ts";
import { assertDefined } from "../../../utilities.ts";

describe("initialExpression", () => {
  it("runs once when the item first becomes enabled", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "gate",
          text: "Gate",
          type: "boolean",
        },
        {
          linkId: "name",
          text: "Name",
          type: "string",
          extension: [makeInitialExpression("namePrefill", "'prefill'")],
          enableWhen: [
            {
              question: "gate",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const gate = form.scope.lookupNode("gate");
    const name = form.scope.lookupNode("name");

    assertQuestionNode(gate);
    assertQuestionNode(name);

    expect(name.isEnabled).toBe(false);
    expect(name.answers[0]?.value).toBeUndefined();

    const gateAnswer = gate.answers[0];
    assertDefined(gateAnswer);
    gateAnswer.setValueByUser(true);
    expect(name.isEnabled).toBe(true);
    expect(name.answers[0]?.value).toBe("prefill");

    const nameAnswer = name.answers[0];
    assertDefined(nameAnswer);
    nameAnswer.setValueByUser("custom");

    gateAnswer.setValueByUser(false);
    gateAnswer.setValueByUser(true);
    expect(name.answers[0]?.value).toBe("custom");
  });

  it("caps repeating initialExpression seeding to maxOccurs limits", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "history",
          type: "string",
          repeats: true,
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
              valueInteger: 2,
            },
            makeInitialExpression(undefined, "'Alpha' | 'Beta' | 'Gamma'"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const history = form.scope.lookupNode("history");

    assertQuestionNode(history);

    expect(history.repeats).toBe(true);
    expect(history.answers).toHaveLength(2);
    expect(history.answers.map((answer) => answer.value)).toEqual([
      "Alpha",
      "Beta",
    ]);
  });

  it("exposes named initial expressions for descendants", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "parent",
          type: "group",
          item: [
            {
              linkId: "answer",
              type: "string",
              extension: [makeInitialExpression("baseInit", "'value'")],
              item: [
                {
                  linkId: "mirror",
                  type: "string",
                  extension: [makeCalculatedExpression(undefined, "%baseInit")],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const answer = form.scope.lookupNode("answer");

    assertQuestionNode(answer);

    const mirror = answer.answers[0]?.nodes.find(
      (child) => child.linkId === "mirror",
    );

    assertQuestionNode(mirror);

    expect(mirror.answers[0]?.value).toBe("value");
  });

  it("captures errors from initial expressions that reference unknown variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "target",
          type: "string",
          extension: [makeInitialExpression(undefined, "%missingInit")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const target = form.scope.lookupNode("target");

    assertQuestionNode(target);

    const issue = target.issues.find((entry) => entry.code === "invalid");
    expect(issue).toBeTruthy();
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate initial expression",
    );
    expect(issue?.diagnostics).toContain(
      "because it references unavailable data",
    );
    expect(target.answers[0]?.value).toBeUndefined();
  });

  it("captures syntax errors from initial expressions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "target",
          type: "string",
          extension: [makeInitialExpression(undefined, "1 +")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const target = form.scope.lookupNode("target");

    assertQuestionNode(target);

    const issue = target.issues.find((entry) => entry.code === "invalid");
    expect(issue).toBeTruthy();
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate initial expression",
    );
    expect(issue?.diagnostics).toContain(
      "because the expression has a syntax error",
    );
    expect(target.answers[0]?.value).toBeUndefined();
  });

  describe("readOnly propagation", () => {
    it("cascades group readOnly to descendants", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "group",
            type: "group",
            readOnly: true,
            item: [
              {
                linkId: "child",
                type: "string",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("group");
      const child = form.scope.lookupNode("child");

      assertGroupNode(group);
      assertQuestionNode(child);

      expect(group.readOnly).toBe(true);
      expect(child.readOnly).toBe(true);
    });

    it("does not cascade question readOnly to nested items", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "parent",
            type: "string",
            readOnly: true,
            item: [
              {
                linkId: "detail",
                type: "string",
              },
            ],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        questionnaire: "Questionnaire/readonly",
        item: [
          {
            linkId: "parent",
            answer: [
              {
                valueString: "value",
                item: [
                  {
                    linkId: "detail",
                    answer: [{ valueString: "child" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const parent = form.scope.lookupNode("parent");

      assertQuestionNode(parent);

      const detail = parent.answers[0]?.nodes.find(
        (child) => child.linkId === "detail",
      );

      assertQuestionNode(detail);

      expect(parent.readOnly).toBe(true);
      expect(detail.readOnly).toBe(false);
    });
  });
});
