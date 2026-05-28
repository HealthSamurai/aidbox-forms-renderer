import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import {
  assertDisplayNode,
  isDisplayNode,
} from "@formbox/renderer/store/display/display-store.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
describe("type.display", () => {
  const questionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [{ linkId: "intro", text: "Welcome", type: "display" }],
  };

  const createStore = () =>
    new FormStore(en, "r5", "form", questionnaire, undefined, undefined);

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
    expect(introStore.token).toBe("form__intro");
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

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaireWithChild,
      undefined,
      undefined,
    );
    expect(form.scope.lookupNode("child")).toBeUndefined();
  });
});
