import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCalculatedExpression,
  makeInitialExpression,
} from "../../../../../../utilities.ts";

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

  it("allows initialExpression to override template defaults", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "favorite",
          text: "Favorite color",
          type: "string",
          initial: [{ valueString: "Template" }],
          extension: [makeInitialExpression(undefined, "'Expression'")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("favorite");
    expect(node).toBeDefined();
    assertQuestionNode(node);

    expect(node.answers.at(0)?.value).toBe("Expression");
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
});
