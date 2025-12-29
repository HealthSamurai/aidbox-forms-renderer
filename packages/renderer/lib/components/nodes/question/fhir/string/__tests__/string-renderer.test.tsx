import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { StringRenderer } from "../string-renderer.tsx";
import { EXT, ITEM_CONTROL_SYSTEM } from "../../../../../../utils.ts";
import type { IQuestionNode } from "../../../../../../types.ts";

function getQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected question node");
  }
  return node as IQuestionNode<"string" | "text" | "url">;
}

describe("string-renderer", () => {
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
  });

  describe("entry format", () => {
    it("uses entryFormat extension as placeholder", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "mrn",
            text: "Medical record number",
            type: "string",
            extension: [
              {
                url: EXT.ENTRY_FORMAT,
                valueString: "MRN-####",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuestion(form, "mrn");

      render(<StringRenderer node={question} />);

      const input = screen.getByLabelText(
        "Medical record number",
      ) as HTMLInputElement;
      expect(input.placeholder).toBe("MRN-####");
    });

    it("uses prompt item text when entryFormat is absent", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "notes",
            text: "Notes",
            type: "text",
            item: [
              {
                linkId: "notes-prompt",
                type: "display",
                text: "Add any relevant context",
                extension: [
                  {
                    url: EXT.ITEM_CONTROL,
                    valueCodeableConcept: {
                      coding: [
                        {
                          system: ITEM_CONTROL_SYSTEM,
                          code: "prompt",
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuestion(form, "notes");

      render(<StringRenderer node={question} />);

      const textarea = screen.getByLabelText("Notes") as HTMLTextAreaElement;
      expect(textarea.placeholder).toBe("Add any relevant context");
    });
  });

  describe("length constraints", () => {
    it("applies minLength extension and maxLength property as input attributes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "nickname",
            text: "Nickname",
            type: "string",
            maxLength: 10,
            extension: [
              {
                url: EXT.MIN_LENGTH,
                valueInteger: 2,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuestion(form, "nickname");

      render(<StringRenderer node={question} />);

      const input = screen.getByLabelText("Nickname") as HTMLInputElement;
      expect(input).toHaveAttribute("minlength", "2");
      expect(input).toHaveAttribute("maxlength", "10");
    });
  });
});
