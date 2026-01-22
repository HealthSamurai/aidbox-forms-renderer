import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertDisplayNode,
  isDisplayNode,
} from "@formbox/renderer/store/display/display-store.ts";

describe("type.display", () => {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [{ linkId: "intro", text: "Welcome", type: "display" }],
  };

  const createStore = () => new FormStore(questionnaire);

  it("creates a display store for display items", () => {
    const form = createStore();
    const introStore = form.scope.lookupNode("intro");
    assertDisplayNode(introStore);
    expect(isDisplayNode(introStore)).toBe(true);
  });

  it("preserves the display item token", () => {
    const form = createStore();
    const introStore = form.scope.lookupNode("intro");
    assertDisplayNode(introStore);
    expect(introStore.token).toBe("__intro");
  });

  it("ignores nested items under display entries", () => {
    const questionnaireWithChild: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "intro",
          text: "Welcome",
          type: "display",
          item: [
            {
              linkId: "child",
              text: "Child question",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaireWithChild);
    expect(form.scope.lookupNode("child")).toBeUndefined();
  });
});
