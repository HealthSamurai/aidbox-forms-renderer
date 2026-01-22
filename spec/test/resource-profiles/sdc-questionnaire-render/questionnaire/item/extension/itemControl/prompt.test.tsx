import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT, ITEM_CONTROL_SYSTEM } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getTextQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected text question");
  }
  return node as IQuestionNode<"text">;
}

describe("itemControl.prompt", () => {
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
    const question = getTextQuestion(form, "notes");

    render(<StringRenderer node={question} />);

    const textarea = screen.getByLabelText("Notes") as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe("Add any relevant context");
  });
});
