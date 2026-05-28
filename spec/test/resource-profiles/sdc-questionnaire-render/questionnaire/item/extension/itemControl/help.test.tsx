import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { NodeHelp } from "@formbox/renderer/component/node/node-help.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";

import type { QuestionnaireItemOf } from "@formbox/renderer";
type QuestionnaireItem = QuestionnaireItemOf<"r5">;
function makeQuestionnaireItem(helpText?: string): QuestionnaireItem {
  return {
    linkId: "question",
    text: "Question text",
    type: "string",
    item: helpText
      ? [
          {
            linkId: "question-help",
            type: "display",
            text: helpText,
            extension: [
              {
                url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                valueCodeableConcept: {
                  coding: [
                    {
                      system: "http://hl7.org/fhir/questionnaire-item-control",
                      code: "help",
                    },
                  ],
                },
              },
            ],
          },
        ]
      : undefined,
  };
}

describe("itemControl.help", () => {
  it("renders nothing when the node has no help text", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [makeQuestionnaireItem()],
      },
      undefined,
      undefined,
    );
    const node = form.scope.lookupNode("question");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) {
      throw new Error("Missing question node");
    }

    const { container } = render(<NodeHelp node={node} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders help badge and tooltip when help is present", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [makeQuestionnaireItem("Helpful guidance")],
      },
      undefined,
      undefined,
    );
    const node = form.scope.lookupNode("question");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) {
      throw new Error("Missing question node");
    }

    const { getByRole, getAllByText } = render(<NodeHelp node={node} />);
    const button = getByRole("button", { name: "More information" });
    expect(button).toBeInTheDocument();
    const [tooltip, srText] = getAllByText("Helpful guidance");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(button.nextSibling).toBe(tooltip);
    expect(srText.tagName.toLowerCase()).toBe("span");
  });
});
