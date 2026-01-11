import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../store/form/form-store.ts";
import { isQuestionNode } from "../../../../../../store/question/question-store.ts";
import { StringRenderer } from "../../string/string-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";

function getUrlQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected url question");
  }
  return node as IQuestionNode<"url">;
}

describe("url-renderer", () => {
  describe("rendering", () => {
    it("renders a url input and seeds the response value", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "website",
            text: "Website",
            type: "url",
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
        item: [
          {
            linkId: "website",
            answer: [
              {
                valueUri: "https://example.org",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getUrlQuestion(form, "website");

      render(<StringRenderer node={question} />);

      const input = screen.getByLabelText("Website") as HTMLInputElement;
      expect(input.type).toBe("url");
      expect(input.value).toBe("https://example.org");
    });
  });
});
