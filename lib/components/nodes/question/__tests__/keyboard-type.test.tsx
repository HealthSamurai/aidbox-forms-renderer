import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { Node } from "../../../form/node.tsx";
import { EXT } from "../../../../utils.ts";

function getQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected question node");
  }
  return node;
}

describe("keyboard extension", () => {
  it("applies tel input mode for phone keyboard type on string questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "contact-phone",
          text: "Contact phone",
          type: "string",
          extension: [
            {
              url: EXT.SDC_KEYBOARD,
              valueCoding: {
                system: "http://hl7.org/fhir/uv/sdc/ValueSet/keyboardType",
                code: "phone",
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getQuestion(form, "contact-phone");

    expect(question.keyboardType).toBe("tel");

    render(<Node node={question} />);

    const input = screen.getByLabelText("Contact phone") as HTMLInputElement;
    expect(input.getAttribute("inputmode")).toBe("tel");
  });

  it("applies text input mode for chat keyboard type on text questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "chat-text",
          text: "Chat message",
          type: "text",
          extension: [
            {
              url: EXT.SDC_KEYBOARD,
              valueCoding: {
                system: "http://hl7.org/fhir/uv/sdc/ValueSet/keyboardType",
                code: "chat",
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getQuestion(form, "chat-text");

    expect(question.keyboardType).toBe("text");

    render(<Node node={question} />);

    const textarea = screen.getByLabelText(
      "Chat message",
    ) as HTMLTextAreaElement;
    expect(textarea.getAttribute("inputmode")).toBe("text");
  });

  it("ignores unsupported keyboard codes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "other",
          text: "Other",
          type: "string",
          extension: [
            {
              url: EXT.SDC_KEYBOARD,
              valueCoding: {
                code: "unsupported",
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getQuestion(form, "other");

    expect(question.keyboardType).toBeUndefined();

    render(<Node node={question} />);

    const input = screen.getByLabelText("Other") as HTMLInputElement;
    expect(input.hasAttribute("inputmode")).toBe(false);
  });
});
