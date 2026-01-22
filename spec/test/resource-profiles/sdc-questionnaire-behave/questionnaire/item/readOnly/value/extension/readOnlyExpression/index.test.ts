import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCqfExpression,
  makeVariable,
} from "../../../../../../../../utilities.ts";

describe("readOnlyExpression", () => {
  it("toggles question interactivity based on expressions on _readOnly", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "lockFlag",
              "%context.item.where(linkId='lock').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "lock",
              text: "Lock answers?",
              type: "boolean",
            },
            {
              linkId: "detail",
              text: "Details",
              type: "string",
              _readOnly: {
                extension: [makeCqfExpression("%lockFlag")],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const lock = form.scope.lookupNode("lock");
    const detail = form.scope.lookupNode("detail");

    assertQuestionNode(lock);
    assertQuestionNode(detail);

    expect(detail.readOnly).toBe(false);
    expect(detail.expressionRegistry.readOnly).toBeDefined();
    expect(detail.expressionRegistry.readOnly?.error).toBeUndefined();

    const lockAnswer = lock.answers[0];
    assertDefined(lockAnswer);
    lockAnswer.setValueByUser(true);
    expect(detail.readOnly).toBe(true);
    expect(detail.expressionRegistry.readOnly?.error).toBeUndefined();

    lockAnswer.setValueByUser(false);
    expect(detail.readOnly).toBe(false);
  });

  it("cascades computed group readOnly state to descendants", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "section",
          type: "group",
          extension: [
            makeVariable(
              "lockFlag",
              "%context.item.where(linkId='lock').answer.valueBoolean.last()",
            ),
          ],
          _readOnly: {
            extension: [makeCqfExpression("%lockFlag")],
          },
          item: [
            {
              linkId: "lock",
              text: "Lock section?",
              type: "boolean",
            },
            {
              linkId: "child",
              text: "Child",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const section = form.scope.lookupNode("section");
    const lock = form.scope.lookupNode("lock");
    const child = form.scope.lookupNode("child");

    assertGroupNode(section);
    assertQuestionNode(lock);
    assertQuestionNode(child);

    expect(section.readOnly).toBe(false);
    expect(child.readOnly).toBe(false);

    const lockAnswer = lock.answers[0];
    assertDefined(lockAnswer);
    lockAnswer.setValueByUser(true);
    expect(section.readOnly).toBe(true);
    expect(child.readOnly).toBe(true);

    lockAnswer.setValueByUser(false);
    expect(section.readOnly).toBe(false);
    expect(child.readOnly).toBe(false);
  });

  it("keeps nodes interactive when _readOnly expressions fail", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "detail",
          text: "Detail",
          type: "string",
          _readOnly: {
            extension: [makeCqfExpression("%missingFlag")],
          },
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const detail = form.scope.lookupNode("detail");

    assertQuestionNode(detail);

    expect(detail.readOnly).toBe(false);

    const slot = detail.expressionRegistry.readOnly;
    expect(slot).toBeDefined();
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate read-only expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it references unavailable data",
    );
  });
});
