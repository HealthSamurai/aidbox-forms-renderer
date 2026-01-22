import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getTextQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected text question");
  }
  return node as IQuestionNode<"text">;
}

describe("type.text", () => {
  it("renders a text area and seeds the response value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
      item: [
        {
          linkId: "notes",
          answer: [{ valueString: "Patient reports mild fatigue." }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const question = getTextQuestion(form, "notes");

    render(<StringRenderer node={question} />);

    const textarea = screen.getByLabelText("Notes") as HTMLTextAreaElement;
    expect(textarea.tagName.toLowerCase()).toBe("textarea");
    expect(textarea.value).toBe("Patient reports mild fatigue.");
  });
});
