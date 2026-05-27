import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.inline", () => {
  it("keeps inline display items as regular child nodes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "name",
          text: "Name",
          type: "string",
          item: [
            {
              linkId: "name-inline",
              text: "Inline guidance",
              type: "display",
              extension: [itemControlExtension("inline")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const question = getQuestionNode(form, "name");

    expect(question.answers.at(0)?.nodes.map((node) => node.linkId)).toContain(
      "name-inline",
    );
  });
});
