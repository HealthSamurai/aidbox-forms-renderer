import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import {
  assertGroupNode,
  isGroupNode,
} from "@formbox/renderer/store/group/group-store.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
describe("type.group", () => {
  it("creates a group node with child items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "section",
          text: "Section",
          type: "group",
          item: [
            {
              linkId: "question",
              text: "Question",
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
    const group = form.scope.lookupNode("section");
    expect(group && isGroupNode(group)).toBe(true);
    assertGroupNode(group);
    expect(group.nodes).toHaveLength(1);
    expect(group.nodes.at(0)?.linkId).toBe("question");
  });
});
