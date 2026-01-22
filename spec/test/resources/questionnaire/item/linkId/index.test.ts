import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";

describe("linkId", () => {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      { linkId: "intro", text: "Welcome", type: "display" },
      {
        linkId: "section",
        text: "Section",
        type: "group",
        item: [
          {
            linkId: "section-question",
            text: "Name",
            type: "string",
          },
        ],
      },
      { linkId: "standalone-question", text: "Ready?", type: "boolean" },
    ],
  };

  const createStore = () => new FormStore(questionnaire);

  it("creates node stores for each top-level item", () => {
    const form = createStore();
    expect(form.nodes).toHaveLength(3);
  });

  it("indexes linkIds for top-level and nested items", () => {
    const form = createStore();
    const expectedIds = [
      "intro",
      "section",
      "section-question",
      "standalone-question",
    ];
    expectedIds.forEach((linkId) => {
      expect(form.scope.lookupNode(linkId)).toBeDefined();
    });
  });
});
