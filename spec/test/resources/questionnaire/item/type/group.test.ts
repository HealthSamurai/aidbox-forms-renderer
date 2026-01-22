import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertGroupNode,
  isGroupNode,
} from "@formbox/renderer/store/group/group-store.ts";

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

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("section");
    expect(group && isGroupNode(group)).toBe(true);
    assertGroupNode(group);
    expect(group.nodes).toHaveLength(1);
    expect(group.nodes.at(0)?.linkId).toBe("question");
  });
});
