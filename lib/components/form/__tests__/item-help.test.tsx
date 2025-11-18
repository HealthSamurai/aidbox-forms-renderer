import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { QuestionnaireItem } from "fhir/r5";

import { NodeHelp } from "../node-help.tsx";
import { FormStore } from "../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../stores/nodes/questions/question-store.ts";

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

describe("NodeHelp", () => {
  it("renders nothing when the node has no help text", () => {
    const form = new FormStore({
      resourceType: "Questionnaire",
      status: "active",
      item: [makeQuestionnaireItem()],
    });
    const node = form.scope.lookupNode("question");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node))
      throw new Error("Missing question node");

    const { container } = render(<NodeHelp node={node} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders help badge and tooltip when help is present", () => {
    const form = new FormStore({
      resourceType: "Questionnaire",
      status: "active",
      item: [makeQuestionnaireItem("Helpful guidance")],
    });
    const node = form.scope.lookupNode("question");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node))
      throw new Error("Missing question node");

    const { getByRole, getAllByText } = render(<NodeHelp node={node} />);
    const button = getByRole("button", { name: "More information" });
    expect(button).toBeInTheDocument();
    const [tooltip, srText] = getAllByText("Helpful guidance");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(button.nextSibling).toBe(tooltip);
    expect(srText.tagName.toLowerCase()).toBe("span");
  });
});
