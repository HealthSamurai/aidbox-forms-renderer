import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { NodeFlyover } from "@formbox/renderer/component/node/node-flyover.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireItemOf } from "@formbox/renderer";
type QuestionnaireItem = QuestionnaireItemOf<"r5">;

function makeQuestionnaireItem(flyoverText?: string): QuestionnaireItem {
  return {
    linkId: "question",
    text: "Question text",
    type: "string",
    item: flyoverText
      ? [
          {
            linkId: "question-flyover",
            type: "display",
            text: flyoverText,
            extension: [itemControlExtension("flyover")],
          },
        ]
      : undefined,
  };
}

describe("itemControl.flyover", () => {
  it("renders flyover button and tooltip when flyover text is present", () => {
    const form = new FormStore(
      en,
      "r5",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [makeQuestionnaireItem("More explanation")],
      },
      undefined,
      undefined,
    );
    const node = getQuestionNode(form, "question");

    const { getByRole, getAllByText } = render(<NodeFlyover node={node} />);

    const button = getByRole("button", { name: "More context" });
    expect(button).toBeInTheDocument();
    const [tooltip, srText] = getAllByText("More explanation");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(button.nextSibling).toBe(tooltip);
    expect(srText.tagName.toLowerCase()).toBe("span");
  });
});
