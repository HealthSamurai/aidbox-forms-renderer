import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getStringQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected string question");
  }
  return node as IQuestionNode<"string">;
}

describe("type.string", () => {
  it("renders a text input and seeds the response value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "full-name",
          text: "Full name",
          type: "string",
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
      item: [
        {
          linkId: "full-name",
          answer: [{ valueString: "Ada Lovelace" }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const question = getStringQuestion(form, "full-name");

    render(<StringRenderer node={question} />);

    const input = screen.getByLabelText("Full name") as HTMLInputElement;
    expect(input.type).toBe("text");
    expect(input.value).toBe("Ada Lovelace");
  });
});
