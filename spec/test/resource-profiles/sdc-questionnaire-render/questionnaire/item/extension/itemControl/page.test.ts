import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.page", () => {
  it("drives pagination from top-level page groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "page-1",
          text: "Page 1",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              type: "string",
            },
          ],
        },
        {
          linkId: "page-2",
          text: "Page 2",
          type: "group",
          extension: [itemControlExtension("page")],
          item: [
            {
              linkId: "question-2",
              text: "Question 2",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);

    expect(getGroupNode(form, "page-1").control).toBe("page");
    expect(form.pagination?.current).toBe(1);
    expect(form.pagination?.total).toBe(2);
    expect(form.contentNodes.at(0)?.linkId).toBe("page-1");

    form.pagination?.onNext();

    expect(form.pagination?.current).toBe(2);
    expect(form.contentNodes.at(0)?.linkId).toBe("page-2");
  });
});
