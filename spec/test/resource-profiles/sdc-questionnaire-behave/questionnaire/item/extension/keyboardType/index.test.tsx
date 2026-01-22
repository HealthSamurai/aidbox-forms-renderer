import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected question node");
  }
  return node as IQuestionNode<"string" | "text">;
}

describe("keyboardType", () => {
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

    render(<StringRenderer node={question} />);

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

    render(<StringRenderer node={question} />);

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

    render(<StringRenderer node={question} />);

    const input = screen.getByLabelText("Other") as HTMLInputElement;
    expect(input.hasAttribute("inputmode")).toBe(false);
  });

  it("does not inherit keyboardType from ancestor items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          text: "Group",
          type: "group",
          extension: [
            {
              url: EXT.SDC_KEYBOARD,
              valueCoding: {
                system: "http://hl7.org/fhir/uv/sdc/ValueSet/keyboardType",
                code: "phone",
              },
            },
          ],
          item: [
            {
              linkId: "child",
              text: "Child",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const child = getQuestion(form, "child");

    expect(child.keyboardType).toBeUndefined();

    render(<StringRenderer node={child} />);

    const input = screen.getByLabelText("Child") as HTMLInputElement;
    expect(input.hasAttribute("inputmode")).toBe(false);
  });
});
