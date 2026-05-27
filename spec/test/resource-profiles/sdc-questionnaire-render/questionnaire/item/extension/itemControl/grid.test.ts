import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.grid", () => {
  it("recognizes grid as a valid group control for grouped rows", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "grid",
          text: "Grid",
          type: "group",
          extension: [itemControlExtension("grid")],
          item: [
            {
              linkId: "row-1",
              text: "Row 1",
              type: "group",
              item: [
                {
                  linkId: "row-1-question",
                  text: "Question 1",
                  type: "string",
                },
              ],
            },
            {
              linkId: "row-2",
              text: "Row 2",
              type: "group",
              item: [
                {
                  linkId: "row-2-question",
                  text: "Question 2",
                  type: "string",
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const group = getGroupNode(form, "grid");

    expect(group.control).toBe("grid");
    expect(form.issues).toHaveLength(0);
  });
});
