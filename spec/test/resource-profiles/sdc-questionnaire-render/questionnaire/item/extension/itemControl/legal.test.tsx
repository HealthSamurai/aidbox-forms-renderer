import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { NodeLegal } from "@formbox/renderer/component/node/node-legal.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireItemOf } from "@formbox/renderer";
type QuestionnaireItem = QuestionnaireItemOf<"r5">;

function makeQuestionnaireItem(legalText?: string): QuestionnaireItem {
  return {
    linkId: "question",
    text: "Question text",
    type: "string",
    item: legalText
      ? [
          {
            linkId: "question-legal",
            type: "display",
            text: legalText,
            extension: [itemControlExtension("legal")],
          },
        ]
      : undefined,
  };
}

describe("itemControl.legal", () => {
  it("renders legal button and dialog content when legal text is present", () => {
    const form = new FormStore(
      en,
      "r5",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [makeQuestionnaireItem("Important notice")],
      },
      undefined,
      undefined,
    );
    const node = getQuestionNode(form, "question");

    const { getByRole, getAllByText } = render(<NodeLegal node={node} />);

    const button = getByRole("button", { name: "Legal information" });
    expect(button).toBeInTheDocument();
    const [dialog, srText] = getAllByText("Important notice");
    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(button.nextSibling).toBe(dialog);
    expect(srText.tagName.toLowerCase()).toBe("span");
  });
});
