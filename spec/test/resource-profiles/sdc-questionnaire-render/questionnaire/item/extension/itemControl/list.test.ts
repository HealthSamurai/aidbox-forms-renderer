import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.list", () => {
  it("recognizes list as a group control", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "section",
          text: "Section",
          type: "group",
          extension: [itemControlExtension("list")],
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

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const group = getGroupNode(form, "section");

    expect(group.control).toBe("list");
    expect(form.issues).toHaveLength(0);
  });
});
