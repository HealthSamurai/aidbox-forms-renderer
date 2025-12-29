import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { DateRenderer } from "../date-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";

function getDateQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected date question");
  }
  return node as IQuestionNode<"date">;
}

describe("date-renderer", () => {
  describe("rendering", () => {
    it("renders a date input and seeds the response value", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "dob",
            text: "Date of birth",
            type: "date",
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
        item: [
          {
            linkId: "dob",
            answer: [
              {
                valueDate: "1984-11-02",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getDateQuestion(form, "dob");

      render(<DateRenderer node={question} />);

      const input = screen.getByLabelText("Date of birth") as HTMLInputElement;
      expect(input.type).toBe("date");
      expect(input.value).toBe("1984-11-02");
    });
  });
});
